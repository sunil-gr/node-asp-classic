document.addEventListener('DOMContentLoaded', () => {
    // --- API & State ---
    const apiBaseUrl = 'http://localhost:5000/api';
    let token = localStorage.getItem('token');
    let dataTables = {}; // To hold references to the datatables

    // --- DOM Element Cache ---
    const elements = {
        // Navigation
        loginLink: document.getElementById('login-link'),
        registerLink: document.getElementById('register-link'),
        dashboardLink: document.getElementById('dashboard-link'),
        coursesLink: document.getElementById('courses-link'),
        scormLink: document.getElementById('scorm-link'),
        logoutLink: document.getElementById('logout-link'),
        // Sections
        authSection: document.getElementById('auth-section'),
        viewSections: document.querySelectorAll('.view-section'),
        // Forms
        loginForm: document.getElementById('login-form'),
        registerForm: document.getElementById('register-form'),
        courseForm: document.getElementById('course-form'),
        catalogForm: document.getElementById('catalog-form'),
        scormForm: document.getElementById('scorm-form'),
        // "Add New" Buttons
        newCatalogBtn: document.getElementById('new-catalog-btn'),
        newCourseBtn: document.getElementById('new-course-btn'),
        newScormBtn: document.getElementById('new-scorm-btn'),
        // Cancel Buttons
        cancelCatalogBtn: document.getElementById('cancel-catalog-edit-btn'),
        cancelCourseBtn: document.getElementById('cancel-course-edit-btn'),
        cancelScormBtn: document.getElementById('cancel-scorm-edit-btn'),
        // Version Modal
        versionModal: document.getElementById('version-modal'),
        closeModalBtn: document.querySelector('.close-btn'),
        addVersionForm: document.getElementById('add-version-form'),
        currentVersionsList: document.getElementById('current-versions-list'),
    };

    // --- Core UI Functions ---
    const updateNav = () => {
        const isLogged = !!token;
        elements.loginLink.classList.toggle('hidden', isLogged);
        elements.registerLink.classList.toggle('hidden', isLogged);
        elements.dashboardLink.classList.toggle('hidden', !isLogged);
        elements.coursesLink.classList.toggle('hidden', !isLogged);
        elements.scormLink.classList.toggle('hidden', !isLogged);
        elements.logoutLink.classList.toggle('hidden', !isLogged);
    };

    const showView = (viewId) => {
        elements.viewSections.forEach(s => s.classList.add('hidden'));
        elements.authSection.classList.add('hidden');
        const section = document.getElementById(viewId);
        if (section) section.classList.remove('hidden');
    };

    // --- API Helper ---
    const fetchAPI = async (endpoint, options = {}) => {
        options.headers = { 'Content-Type': 'application/json', ...options.headers, 'Authorization': `Bearer ${token}` };
        const response = await fetch(`${apiBaseUrl}/${endpoint}`, options);
        if (response.status === 204) return null; // Handle No Content response
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'An API error occurred');
        return data;
    };

    // --- DataTable Management ---
    const initializeTable = (tableId, columns) => {
        dataTables[tableId] = $(tableId).DataTable({
            destroy: true,
            data: [],
            columns: columns,
        });
    };

    const populateTable = (tableId, data) => {
        const table = dataTables[tableId];
        if (table) {
            table.clear().rows.add(data || []).draw();
        }
    };
    
    // Make refresh functions globally available for data-attributes
    window.refreshCatalogs = () => fetchAPI('catalogs').then(data => populateTable('#catalogs-table', data));
    window.refreshCourses = () => fetchAPI('courses').then(data => populateTable('#courses-table', data));
    window.refreshScormPackages = () => fetchAPI('scorm-packages').then(data => populateTable('#scorm-table', data));

    // --- Form Handlers ---
    const handleFormSubmit = async (form) => {
        const id = form.dataset.id;
        const endpoint = form.dataset.endpoint;
        const refreshFnName = form.dataset.refreshFn;
        
        const body = Object.fromEntries(new FormData(form));
        // Handle checkbox - FormData doesn't include unchecked boxes
        const checkbox = form.querySelector('input[type=checkbox]');
        if(checkbox) {
            body[checkbox.name] = checkbox.checked;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${endpoint}/${id}` : endpoint;

        try {
            await fetchAPI(url, { method, body: JSON.stringify(body) });
            form.classList.add('hidden');
            form.reset();
            form.removeAttribute('data-id');
            if(refreshFnName && window[refreshFnName]) {
                window[refreshFnName]();
            }
        } catch (error) {
            alert(`Save failed: ${error.message}`);
        }
    };

    // --- UNIVERSAL CLICK HANDLER using Event Delegation ---
    document.body.addEventListener('click', async (e) => {
        const target = e.target;

        // --- Navigation ---
        if (target.matches('#dashboard-link')) { e.preventDefault(); showView('dashboard-section'); window.refreshCatalogs(); }
        if (target.matches('#courses-link')) { e.preventDefault(); showView('courses-section'); window.refreshCourses(); }
        if (target.matches('#scorm-link')) { e.preventDefault(); showView('scorm-section'); window.refreshScormPackages(); }
        if (target.matches('#login-link')) { e.preventDefault(); showView('auth-section'); document.getElementById('login-form').classList.remove('hidden'); document.getElementById('register-form').classList.add('hidden'); }
        if (target.matches('#register-link')) { e.preventDefault(); showView('auth-section'); document.getElementById('register-form').classList.remove('hidden'); document.getElementById('login-form').classList.add('hidden'); }
        if (target.matches('#logout-link')) { e.preventDefault(); token = null; localStorage.removeItem('token'); updateNav(); showView('auth-section'); document.getElementById('login-form').classList.remove('hidden');}
        
        // --- "Add New" Buttons ---
        if (target.matches('.new-btn')) {
            const form = document.querySelector(target.dataset.form);
            form.reset();
            form.removeAttribute('data-id');
            form.classList.remove('hidden');
        }

        // --- "Cancel" Buttons ---
        if (target.matches('.cancel-btn')) {
            e.preventDefault();
            target.closest('form').classList.add('hidden');
        }

        // --- Modal ---
        if (target.matches('.close-btn') || target.matches('#version-modal')) { document.getElementById('version-modal').classList.add('hidden'); }
        
        // --- DataTable Actions (Edit, Delete, Versions) ---
        const tableRow = target.closest('tr');
        if (tableRow && tableRow.parentElement.tagName === 'TBODY') {
            const tableElement = target.closest('table');
            const table = dataTables['#' + tableElement.id];
            if (!table) return;

            const rowData = table.row(tableRow).data();
            if(!rowData) return;

            if (target.matches('.edit-btn')) {
                const form = document.querySelector(target.dataset.form);
                form.reset();
                form.setAttribute('data-id', rowData.id);
                for(const key in rowData) {
                    const input = form.elements[key];
                    if(input) {
                        if(input.type === 'checkbox') input.checked = rowData[key];
                        else input.value = rowData[key];
                    }
                }
                 // Manually set hidden ID field if it's not part of the form's named elements
                const idInput = form.querySelector('input[type=hidden]');
                if (idInput) idInput.value = rowData.id;

                form.classList.remove('hidden');
            }

            if (target.matches('.delete-btn')) {
                const refreshFn = window[target.dataset.refreshFn];
                if (confirm(`Are you sure you want to delete this item?`)) {
                    await fetchAPI(`${target.dataset.endpoint}/${rowData.id}`, { method: 'DELETE' });
                    if(refreshFn) refreshFn();
                }
            }

            if (target.matches('.manage-versions-btn')) {
                document.getElementById('version-modal-title').textContent = `Manage Versions for: ${rowData.name}`;
                document.getElementById('add-version-form').setAttribute('data-catalog-id', rowData.id);
        
                const [catalogDetails, allCourses] = await Promise.all([ fetchAPI(`catalogs/${rowData.id}`), fetchAPI('courses') ]);
                
                document.getElementById('add-version-course-id').innerHTML = allCourses.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
                
                const renderVersions = (versions) => {
                     document.getElementById('current-versions-list').innerHTML = (versions || []).map(v =>`<li>${v.title} <button class="delete-version-btn" data-course-id="${v.id}">Remove</button></li>`).join('');
                }
                renderVersions(catalogDetails.Versions);
                document.getElementById('version-modal').classList.remove('hidden');
            }

            if(target.matches('.delete-version-btn')) {
                const catalogId = document.getElementById('add-version-form').dataset.catalogId;
                const courseId = target.dataset.courseId;
                if (confirm('Are you sure you want to remove this version?')) {
                    await fetchAPI('catalogs/delete-version', { method: 'POST', body: JSON.stringify({ catalogId, courseId }) });
                    target.parentElement.remove();
                }
            }

            if (target.matches('.manage-packages-btn')) {
                document.getElementById('package-modal-title').textContent = `Manage Packages for: ${rowData.title}`;
                document.getElementById('add-package-form').setAttribute('data-course-id', rowData.id);

                const [courseDetails, allPackages] = await Promise.all([ fetchAPI(`courses/${rowData.id}`), fetchAPI('scorm-packages') ]);
                
                document.getElementById('add-package-id').innerHTML = allPackages.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
                
                const renderPackages = (packages) => {
                     document.getElementById('current-packages-list').innerHTML = (packages || []).map(p =>`<li>${p.title} <button class="delete-package-btn" data-package-id="${p.id}">Remove</button></li>`).join('');
                }
                renderPackages(courseDetails.ScormPackages);
                document.getElementById('package-modal').classList.remove('hidden');
            }

            if(target.matches('.delete-package-btn')) {
                const courseId = document.getElementById('add-package-form').dataset.courseId;
                const scormPackageId = target.dataset.packageId;
                if (confirm('Are you sure you want to remove this package?')) {
                    await fetchAPI('courses/remove-package', { method: 'POST', body: JSON.stringify({ courseId, scormPackageId }) });
                    target.parentElement.remove();
                }
            }
        }
    });

    // --- UNIVERSAL FORM SUBMIT HANDLER ---
    document.body.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;

        if (form.id === 'login-form') {
            try {
                const data = await fetchAPI('auth/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
                token = data.token;
                localStorage.setItem('token', token);
                updateNav();
                document.getElementById('dashboard-link').click();
            } catch (error) { alert(`Login Failed: ${error.message}`); }
        } else if (form.id === 'register-form') {
             try {
                await fetchAPI('auth/register', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
                alert('Registration successful! Please log in.');
                document.getElementById('login-link').click();
            } catch (error) { alert(`Registration Failed: ${error.message}`); }
        } else if (form.id === 'add-version-form') {
             const catalogId = form.dataset.catalogId;
             const courseId = form.elements['courseId'].value;
             await fetchAPI('catalogs/add-version', { method: 'POST', body: JSON.stringify({ catalogId, courseId }) });
             const catalogDetails = await fetchAPI(`catalogs/${catalogId}`);
             document.getElementById('current-versions-list').innerHTML = (catalogDetails.Versions || []).map(v =>`<li>${v.title} <button class="delete-version-btn" data-course-id="${v.id}">Remove</button></li>`).join('');
        }
        else if (form.id === 'add-package-form') {
            const courseId = form.dataset.courseId;
            const scormPackageId = form.elements['packageId'].value;
            await fetchAPI('courses/add-package', { method: 'POST', body: JSON.stringify({ courseId, scormPackageId }) });
            const courseDetails = await fetchAPI(`courses/${courseId}`);
            document.getElementById('current-packages-list').innerHTML = (courseDetails.ScormPackages || []).map(p =>`<li>${p.title} <button class="delete-package-btn" data-package-id="${p.id}">Remove</button></li>`).join('');
        }
        else {
            handleFormSubmit(form);
        }
    });

    // --- Initial Load ---
    const initializeApp = () => {
        initializeTable('#catalogs-table', [ { title: "Name", data: "name" }, { title: "Description", data: "description" }, { title: "Actions", data: null, orderable: false, defaultContent: `<div class="item-actions"><button class="manage-versions-btn">Versions</button><button class="edit-btn" data-form="#catalog-form">Edit</button><button class="delete-btn" data-endpoint="catalogs" data-refresh-fn="refreshCatalogs">Delete</button></div>` } ]);
        initializeTable('#courses-table', [ { title: "Title", data: "title" }, { title: "Description", data: "description" }, { title: "Actions", data: null, orderable: false, defaultContent: `<div class="item-actions"><button class="manage-packages-btn">Packages</button><button class="edit-btn" data-form="#course-form">Edit</button><button class="delete-btn" data-endpoint="courses" data-refresh-fn="refreshCourses">Delete</button></div>` } ]);
        initializeTable('#scorm-table', [ { title: "Title", data: "title" }, { title: "SCORM Object ID", data: "scoObjectId" }, { title: "Actions", data: null, orderable: false, defaultContent: `<div class="item-actions"><button class="edit-btn" data-form="#scorm-form">Edit</button><button class="delete-btn" data-endpoint="scorm-packages" data-refresh-fn="refreshScormPackages">Delete</button></div>` } ]);
        
        updateNav();
        if (token) {
            document.getElementById('dashboard-link').click();
        } else {
            document.getElementById('login-link').click();
        }
    };

    initializeApp();
}); 