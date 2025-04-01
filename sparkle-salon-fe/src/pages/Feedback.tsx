import { useState, useEffect } from "react";
import { ArrowUpDown, Star, Search, Filter, X, Calendar, User, Package } from "lucide-react";
import { FiStar } from "react-icons/fi";
import { getFeedbacks } from "../data/feedbacksData";
import { getAllTherapists } from "../data/therapistData";
import { servicesData } from "../data/servicesData";
import Pagination from "../components/Pagination";

const FeedbackListing = () => {
  // State for filters and pagination
  const [therapistId, setTherapistId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [rating, setRating] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState("createdAt,desc");
  
  // State for data
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for available therapists and services (for dropdowns)
  const [therapists, setTherapists] = useState([]);
  const [services, setServices] = useState([]);
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        // Construct the API URL with filters
        const apiUrl = `?${therapistId ? `therapistId=${therapistId}&` : ""}${
          serviceId ? `serviceId=${serviceId}&` : ""
        }${rating ? `rating=${rating}&` : ""}page=${
          currentPage - 1
        }&size=${itemsPerPage}&sort=${sort}`;
        
        const response = await getFeedbacks(apiUrl);
        
        
        if(response.content){
            setFeedbacks(response.content);
            setTotalPages(response.totalPages);
        }
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false);
        }
        
    };

    fetchFeedbacks();
  }, [therapistId, serviceId, rating, currentPage, itemsPerPage, sort]);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response= await getAllTherapists();
        if(response){
            setTherapists(response);
        }
      } catch(error){
          console.error("Error fetching therapists:", err);
      }
      
    };
    
    fetchTherapists();
  }, []);

  // Fetch services for dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesData(`?size=100`);
          setServices(response.services);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    
    fetchServices();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [therapistId, serviceId, rating, sort]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FiStar
          key={i}
          size={16}
          className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
        />
      ));
  };

  // Reset all filters
  const handleReset = () => {
    setTherapistId("");
    setServiceId("");
    setRating("");
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (therapistId) count++;
    if (serviceId) count++;
    if (rating) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex ">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4 overflow-auto h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Feedbacks</h1>
          <p className="text-gray-600">Browse and filter customer reviews and feedback</p>
        </div>

        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="font-medium">Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </span>
            <ArrowUpDown size={18} className="text-gray-500" />
          </button>
        </div>

        <div className={`bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden transition-all duration-200 ${showFilters || 'md:block hidden'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filter Results</h2>
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={handleReset}
                  className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-900"
                >
                  <X size={16} />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Therapist
                </label>
                <div className="relative">
                  <select
                    value={therapistId}
                    onChange={(e) => setTherapistId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">All Therapists</option>
                    {therapists.map((therapist) => (
                      <option key={therapist.id} value={therapist.id}>
                        {therapist.fullName}
                      </option>
                    ))}
                  </select>
                  <User size={16} className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <div className="relative">
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">All Services</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <Package size={16} className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="relative">
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="1">1 ⭐</option>
                  </select>
                  <Star size={16} className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="createdAt,desc">Newest First</option>
                    <option value="createdAt,asc">Oldest First</option>
                    <option value="rating,desc">Highest Rating</option>
                    <option value="rating,asc">Lowest Rating</option>
                  </select>
                  <ArrowUpDown size={16} className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
              <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-500 border-t-transparent"></div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-red-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && feedbacks.length === 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full mb-6">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No feedback found</h3>
            <p className="text-gray-500 mb-6">Try changing your search filters</p>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Feedback list */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white rounded-xl flex flex-col h-full overflow-auto  shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feedback.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                        <span className="ml-1 text-sm font-medium text-gray-700">{feedback.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{feedback.feedbackText}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Package size={12} />
                      {feedback.serviceName}
                    </div>
                    <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <User size={12} />
                      {feedback.therapistName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 0 && (
         <Pagination currentPage={currentPage} totalPages={totalPages} paginate={handlePageChange}
         />
        )}
      </div>
    </div>
  );
};

export default FeedbackListing;