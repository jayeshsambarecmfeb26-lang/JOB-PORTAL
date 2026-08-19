import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const JobCard = ({ job }) => {
    // Generate initials from company name
    const initials = job.company?.name ? job.company.name.substring(0, 2).toUpperCase() : 'CO';
    
    // Formatting salary
    const formatSalary = (sal) => {
        if (!sal) return 'Not specified';
        return `₹${(sal / 100000).toFixed(1)} LPA`;
    };

    // Determine badge color based on job type
    const getBadgeStyle = (type) => {
        if (type === 'REMOTE') return { bg: '#faf5ff', text: '#a855f7' };
        if (type === 'PART_TIME') return { bg: '#fffbeb', text: '#d97706' };
        if (type === 'INTERNSHIP') return { bg: '#f0fdf4', text: '#22c55e' };
        return { bg: '#eff6ff', text: '#3b82f6' }; // FULL_TIME
    };
    
    const badgeStyle = getBadgeStyle(job.type);

    return (
        <div className="hover-card p-4 mb-3" style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div className="row">
                <div className="col-md-9 d-flex gap-3">
                    <div className="d-flex align-items-center justify-content-center fw-bold flex-shrink-0" 
                         style={{ width: '56px', height: '56px', borderRadius: '12px', background: badgeStyle.bg, color: badgeStyle.text, fontSize: '1.25rem' }}>
                        {initials}
                    </div>
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <h5 className="fw-bold mb-0">{job.title}</h5>
                        </div>
                        <p className="text-muted small mb-2">{job.company?.name}</p>
                        <div className="d-flex flex-wrap gap-2">
                            <span className="badge fw-normal" 
                                  style={{ 
                                      background: badgeStyle.bg, 
                                      color: badgeStyle.text,
                                      padding: '5px 10px',
                                      fontSize: '0.75rem'
                                  }}>
                                {job.type?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 d-flex flex-column align-items-md-end justify-content-between mt-3 mt-md-0">
                    <div className="text-end">
                        <div className="fw-bold text-primary-custom mb-1">{formatSalary(job.salary)}</div>
                        <div className="text-muted small"><i className="bi bi-geo-alt me-1"></i>{job.location}</div>
                    </div>
                    <div className="text-end mt-2 mt-md-0 d-flex flex-column align-items-end gap-1">
                        <Link to={`/jobs/${job.id}`} className="btn btn-primary-custom btn-sm px-4 fw-bold" style={{ borderRadius: '6px', background: '#0ea5e9', border: 'none', padding: '8px 16px', textDecoration: 'none' }}>View Details</Link>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(job.postedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobListings = () => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [originalJobs, setOriginalJobs] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [locationKeyword, setLocationKeyword] = useState('');
    const [category, setCategory] = useState('All categories');
    const [sortBy, setSortBy] = useState('Most recent');
    const [currentPage, setCurrentPage] = useState(1);
    const [salaryRange, setSalaryRange] = useState([3, 30]);
    const jobsPerPage = 5;
    
    const [filters, setFilters] = useState({
        types: { FULL_TIME: false, PART_TIME: false, REMOTE: false, INTERNSHIP: false },
        locations: { Mumbai: false, Bengaluru: false, Pune: false, Remote: false },
        experience: { Fresher: false, '1-3': false, '3-5': false, '5+': false }
    });

    const handleFilterChange = (category, key) => {
        setFilters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            types: { FULL_TIME: false, PART_TIME: false, REMOTE: false, INTERNSHIP: false },
            locations: { Mumbai: false, Bengaluru: false, Pune: false, Remote: false },
            experience: { Fresher: false, '1-3': false, '3-5': false, '5+': false }
        });
        setKeyword('');
        setLocationKeyword('');
        setCategory('All categories');
        setSalaryRange([3, 30]);
    };

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...originalJobs];

        // 1. Keyword filter
        if (keyword) {
            const lowerK = keyword.toLowerCase();
            filtered = filtered.filter(j => 
                j.title?.toLowerCase().includes(lowerK) || 
                j.company?.name?.toLowerCase().includes(lowerK) ||
                j.description?.toLowerCase().includes(lowerK)
            );
        }

        // 1.5 Location Keyword filter
        if (locationKeyword) {
            const lowerLoc = locationKeyword.toLowerCase();
            filtered = filtered.filter(j => 
                j.location?.toLowerCase().includes(lowerLoc)
            );
        }

        // 1.7 Category filter
        if (category && category !== 'All categories') {
            let catKw = category.toLowerCase();
            if (category === 'Software Engineering') catKw = 'software';
            if (category === 'Design') catKw = 'design';
            if (category === 'Marketing') catKw = 'marketing';
            
            filtered = filtered.filter(j => 
                j.title?.toLowerCase().includes(catKw) || 
                j.description?.toLowerCase().includes(catKw) ||
                j.company?.name?.toLowerCase().includes(catKw)
            );
        }

        // 2. Type filter
        const activeTypes = Object.keys(filters.types).filter(k => filters.types[k]);
        if (activeTypes.length > 0) {
            filtered = filtered.filter(j => activeTypes.includes(j.type));
        }

        // 3. Location filter
        const activeLocations = Object.keys(filters.locations).filter(k => filters.locations[k]);
        if (activeLocations.length > 0) {
            filtered = filtered.filter(j => activeLocations.includes(j.location));
        }

        // 4. Experience filter (derived from salary since no experience field exists)
        const activeExp = Object.keys(filters.experience).filter(k => filters.experience[k]);
        if (activeExp.length > 0) {
            filtered = filtered.filter(j => {
                const s = j.salary || 0;
                if (activeExp.includes('Fresher') && s < 500000) return true;
                if (activeExp.includes('1-3') && s >= 500000 && s < 1000000) return true;
                if (activeExp.includes('3-5') && s >= 1000000 && s < 1500000) return true;
                if (activeExp.includes('5+') && s >= 1500000) return true;
                return false;
            });
        }

        // 5. Salary Range filter
        filtered = filtered.filter(j => {
            if (salaryRange[0] === 3 && salaryRange[1] === 30) {
                return true; // No filter applied if untouched
            }
            const sLpa = (j.salary || 0) / 100000;
            if (sLpa === 0) return false; // Exclude jobs with no salary specified if slider is moved
            
            if (salaryRange[1] === 30) {
                return sLpa >= salaryRange[0];
            }
            return sLpa >= salaryRange[0] && sLpa <= salaryRange[1];
        });

        // 6. Sorting
        if (sortBy === 'Salary: High to Low') {
            filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
        } else if (sortBy === 'Most recent') {
            filtered.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
        }

        setJobs(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [filters, originalJobs, sortBy, keyword, locationKeyword, category, salaryRange]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const searchKw = searchParams.get('search');
        const locKw = searchParams.get('location');
        if (locKw) setLocationKeyword(locKw);

        if (searchKw) {
            setKeyword(searchKw);
            handleSearchKw(searchKw);
        } else {
            fetchJobs();
        }
    }, []);

    const handleSearchKw = async (kw) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/jobs/search?keyword=${encodeURIComponent(kw)}`);
            setOriginalJobs(response.data);
            setJobs(response.data);
        } catch (error) {
            console.error('Failed to search jobs', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/jobs');
            setOriginalJobs(response.data);
            setJobs(response.data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/jobs/search?keyword=${encodeURIComponent(keyword)}`);
            setOriginalJobs(response.data);
            setJobs(response.data);
        } catch (error) {
            console.error('Failed to search jobs', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Search Header */}
            <div style={{ backgroundColor: '#0b1120', padding: '30px 0' }}>
                <div className="container">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <div className="position-relative">
                                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: '#38bdf8', fontSize: '1.1rem' }}></i>
                                <input type="text" className="form-control job-search-input" placeholder="Job title, skill, keyword..." 
                                       style={{ paddingLeft: '45px', paddingRight: '15px', paddingTop: '12px', paddingBottom: '12px' }}
                                       value={keyword}
                                       onChange={(e) => setKeyword(e.target.value)}
                                       onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="position-relative">
                                <i className="bi bi-geo-alt position-absolute top-50 translate-middle-y ms-3" style={{ color: '#38bdf8', fontSize: '1.1rem' }}></i>
                                <input type="text" className="form-control job-search-input" placeholder="City or remote..." 
                                       style={{ paddingLeft: '45px', paddingRight: '15px', paddingTop: '12px', paddingBottom: '12px' }}
                                       value={locationKeyword}
                                       onChange={(e) => setLocationKeyword(e.target.value)}
                                       onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary-custom w-100 fw-bold" onClick={handleSearch} style={{ paddingTop: '12px', paddingBottom: '12px', background: '#0ea5e9', border: 'none' }}>Search Jobs</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Strip */}
            <div className="bg-white border-bottom py-3">
                <div className="container">
                    <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
                        <span className="text-secondary fw-bold small">Type:</span>
                        <span onClick={clearAllFilters} className="badge rounded-pill" style={{ background: Object.values(filters.types).every(v => !v) ? '#0ea5e9' : '#fff', color: Object.values(filters.types).every(v => !v) ? '#fff' : '#64748b', border: '1px solid #e2e8f0', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'normal', cursor: 'pointer' }}>All</span>
                        <span onClick={() => handleFilterChange('types', 'FULL_TIME')} className="badge rounded-pill" style={{ background: filters.types['FULL_TIME'] ? '#0ea5e9' : '#fff', color: filters.types['FULL_TIME'] ? '#fff' : '#64748b', border: '1px solid #e2e8f0', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'normal', cursor: 'pointer' }}>Full Time</span>
                        <span onClick={() => handleFilterChange('types', 'PART_TIME')} className="badge rounded-pill" style={{ background: filters.types['PART_TIME'] ? '#0ea5e9' : '#fff', color: filters.types['PART_TIME'] ? '#fff' : '#64748b', border: '1px solid #e2e8f0', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'normal', cursor: 'pointer' }}>Part Time</span>
                        <span onClick={() => handleFilterChange('types', 'REMOTE')} className="badge rounded-pill" style={{ background: filters.types['REMOTE'] ? '#0ea5e9' : '#fff', color: filters.types['REMOTE'] ? '#fff' : '#64748b', border: '1px solid #e2e8f0', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'normal', cursor: 'pointer' }}>Remote</span>
                        <span onClick={() => handleFilterChange('types', 'INTERNSHIP')} className="badge rounded-pill" style={{ background: filters.types['INTERNSHIP'] ? '#0ea5e9' : '#fff', color: filters.types['INTERNSHIP'] ? '#fff' : '#64748b', border: '1px solid #e2e8f0', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 'normal', cursor: 'pointer' }}>Internship</span>
                    </div>
                    
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <select 
                                className={`form-select custom-dark-select py-2 px-3 fw-medium ${isCategoryOpen ? 'is-open' : ''}`}
                                value={category}
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                onBlur={() => setIsCategoryOpen(false)}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setIsCategoryOpen(false);
                                    e.target.blur();
                                }}
                            >
                                <option>All categories</option>
                                <option>Software Engineering</option>
                                <option>Design</option>
                                <option>Marketing</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-end mt-2">
                        <span className="text-muted small">Showing {jobs.length} jobs</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-4 flex-grow-1">
                <div className="row g-4">
                    {/* Sidebar */}
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="bg-white p-4 h-100" style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            {/* JOB TYPE */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>JOB TYPE</h6>
                                {Object.keys(filters.types).map(type => (
                                    <div key={type} className="form-check mb-2 d-flex justify-content-between align-items-center">
                                        <div>
                                            <input className="form-check-input" type="checkbox" id={`jt-${type}`} 
                                                checked={filters.types[type]} onChange={() => handleFilterChange('types', type)} />
                                            <label className="form-check-label text-secondary small fw-medium" htmlFor={`jt-${type}`}>
                                                {type.replace('_', ' ')}
                                            </label>
                                        </div>
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            {originalJobs.filter(j => j.type === type).length}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* EXPERIENCE */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>EXPERIENCE</h6>
                                <div className="form-check mb-2 d-flex justify-content-between align-items-center">
                                    <div><input className="form-check-input" type="checkbox" id="ex1" checked={filters.experience['Fresher']} onChange={() => handleFilterChange('experience', 'Fresher')} /><label className="form-check-label text-secondary small fw-medium" htmlFor="ex1">Fresher</label></div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{originalJobs.filter(j => (j.salary || 0) < 500000).length}</span>
                                </div>
                                <div className="form-check mb-2 d-flex justify-content-between align-items-center">
                                    <div><input className="form-check-input" type="checkbox" id="ex2" checked={filters.experience['1-3']} onChange={() => handleFilterChange('experience', '1-3')} /><label className="form-check-label text-secondary small fw-medium" htmlFor="ex2">1-3 years</label></div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{originalJobs.filter(j => (j.salary || 0) >= 500000 && (j.salary || 0) < 1000000).length}</span>
                                </div>
                                <div className="form-check mb-2 d-flex justify-content-between align-items-center">
                                    <div><input className="form-check-input" type="checkbox" id="ex3" checked={filters.experience['3-5']} onChange={() => handleFilterChange('experience', '3-5')} /><label className="form-check-label text-secondary small fw-medium" htmlFor="ex3">3-5 years</label></div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{originalJobs.filter(j => (j.salary || 0) >= 1000000 && (j.salary || 0) < 1500000).length}</span>
                                </div>
                                <div className="form-check mb-2 d-flex justify-content-between align-items-center">
                                    <div><input className="form-check-input" type="checkbox" id="ex4" checked={filters.experience['5+']} onChange={() => handleFilterChange('experience', '5+')} /><label className="form-check-label text-secondary small fw-medium" htmlFor="ex4">5+ years</label></div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{originalJobs.filter(j => (j.salary || 0) >= 1500000).length}</span>
                                </div>
                            </div>

                            {/* SALARY RANGE */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>SALARY RANGE</h6>
                                <div className="bg-light p-3 rounded mb-2">
                                    <div className="d-flex justify-content-between small text-muted mb-3" style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                                        <span>₹3 LPA</span>
                                        <span>₹30+ LPA</span>
                                    </div>
                                    <div className="px-2">
                                        <Slider 
                                            range
                                            min={3} 
                                            max={30} 
                                            defaultValue={[3, 30]}
                                            value={salaryRange}
                                            onChange={(val) => setSalaryRange(val)}
                                            styles={{
                                                track: { backgroundColor: '#0ea5e9' },
                                                handle: { borderColor: '#0ea5e9', backgroundColor: '#fff', opacity: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                                                rail: { backgroundColor: '#e2e8f0' }
                                            }}
                                        />
                                    </div>
                                    <div className="text-center small text-primary-custom fw-bold mt-3">
                                        ₹{salaryRange[0]} LPA – {salaryRange[1] === 30 ? '₹30+ LPA' : `₹${salaryRange[1]} LPA`}
                                    </div>
                                </div>
                            </div>

                            {/* LOCATION */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>LOCATION</h6>
                                {Object.keys(filters.locations).map(loc => (
                                    <div key={loc} className="form-check mb-2 d-flex justify-content-between align-items-center">
                                        <div>
                                            <input className="form-check-input" type="checkbox" id={`loc-${loc}`} 
                                                checked={filters.locations[loc]} onChange={() => handleFilterChange('locations', loc)} />
                                            <label className="form-check-label text-secondary small fw-medium" htmlFor={`loc-${loc}`}>
                                                {loc}
                                            </label>
                                        </div>
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            {originalJobs.filter(j => j.location === loc).length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center mt-4">
                                <span onClick={clearAllFilters} className="text-primary-custom small fw-bold" style={{ cursor: 'pointer' }}>Clear all filters</span>
                            </div>
                        </div>
                    </div>

                    {/* Job Cards List */}
                    <div className="col-lg-9">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">{jobs.length} jobs found</h5>
                            <select 
                                className={`form-select form-select-sm custom-dark-select w-auto py-2 px-4 fw-bold ${isSortOpen ? 'is-open' : ''}`} 
                                style={{ borderRadius: '8px' }}
                                value={sortBy}
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                onBlur={() => setIsSortOpen(false)}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setIsSortOpen(false);
                                    e.target.blur();
                                }}
                            >
                                <option>Most recent</option>
                                <option>Salary: High to Low</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary-custom" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Fetching jobs...</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-5 bg-white rounded shadow-sm border">
                                <h5 className="fw-bold">No jobs found</h5>
                                <p className="text-muted">Try adjusting your search filters.</p>
                            </div>
                        ) : (
                            jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map(job => (
                                <JobCard key={job.id} job={job} />
                            ))
                        )}

                        {/* Pagination */}
                        {jobs.length > jobsPerPage && (
                            <div className="d-flex justify-content-center mt-5 mb-4">
                                <nav>
                                    <ul className="pagination gap-2">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <span onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} className="page-link rounded text-muted border-0 bg-white" style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}><i className="bi bi-chevron-left"></i></span>
                                        </li>
                                        
                                        {[...Array(Math.ceil(jobs.length / jobsPerPage)).keys()].map(num => (
                                            <li key={num + 1} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                                                <span onClick={() => setCurrentPage(num + 1)} className="page-link rounded fw-bold" 
                                                      style={currentPage === num + 1 ? { background: '#0ea5e9', borderColor: '#0ea5e9', color: '#fff' } : { color: '#64748b', border: 'none', background: '#fff', cursor: 'pointer' }}>
                                                    {num + 1}
                                                </span>
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentPage === Math.ceil(jobs.length / jobsPerPage) ? 'disabled' : ''}`}>
                                            <span onClick={() => currentPage < Math.ceil(jobs.length / jobsPerPage) && setCurrentPage(currentPage + 1)} className="page-link rounded text-muted border-0 bg-white" style={{ cursor: currentPage === Math.ceil(jobs.length / jobsPerPage) ? 'default' : 'pointer' }}><i className="bi bi-chevron-right"></i></span>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer text-center text-md-start position-relative mt-auto py-4" style={{ backgroundColor: '#0b1120' }}>
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div className="brand-logo h5 mb-0 text-white">Job<span className="text-primary-custom">Hub</span></div>
                    
                    {/* Circle Arrow */}
                    <div className="position-absolute start-50 translate-middle-x d-none d-md-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: '#1e293b' }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                        <i className="bi bi-arrow-down text-muted"></i>
                    </div>

                    <div className="d-flex flex-wrap justify-content-center gap-4 small ms-auto">
                        <div className="small text-muted">&copy; 2026 JobHub. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default JobListings;
