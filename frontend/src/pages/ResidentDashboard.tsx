import { useEffect, useState, useMemo } from 'react';
import { fetchAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { ChatModal } from '../components/ChatModal';
import { useAuthStore } from '../store/authStore';
import { io, Socket } from 'socket.io-client';
import { ServiceCard } from '../components/ServiceCard';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '');

const ResidentDashboard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatBooking, setActiveChatBooking] = useState<any | null>(null);
  const [unreadBookings, setUnreadBookings] = useState<Record<string, boolean>>({});
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For the input before hitting search
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'plumber', 'electrician', 'laundry', 'milk_delivery', 'house_cleaning'];

  useEffect(() => {
    fetchData();
    
    // Global socket connection for notifications
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    newSocket.on('receiveMessage', (message) => {
      // If the chat modal is not open for this booking, mark it as unread
      if (!activeChatBooking || activeChatBooking._id !== message.bookingId) {
        setUnreadBookings(prev => ({ ...prev, [message.bookingId]: true }));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen to bookings loaded to join rooms for notifications
  useEffect(() => {
    if (socket && bookings.length > 0) {
      bookings.forEach(b => socket.emit('joinRoom', b._id));
    }
  }, [socket, bookings]);

  useEffect(() => {
    // Clear unread badge when chat is opened
    if (activeChatBooking) {
      setUnreadBookings(prev => ({ ...prev, [activeChatBooking._id]: false }));
    }
  }, [activeChatBooking]);

  const fetchData = async () => {
    try {
      const [servicesData, bookingsData] = await Promise.all([
        fetchAPI('/services'),
        fetchAPI('/bookings/resident'),
      ]);
      setServices(servicesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (serviceId: string) => {
    try {
      await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId,
          scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          notes: 'Standard booking from dashboard',
        }),
      });
      fetchData(); // Refresh bookings
      alert('Booking created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create booking');
    }
  };

  const handleRate = async (bookingId: string, rating: number) => {
    try {
      await fetchAPI(`/bookings/${bookingId}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating }),
      });
      fetchData(); // Refresh to update the rating display
      alert('Thanks for rating!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit rating');
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (service.providerId?.name || '').toLowerCase().includes(searchLower) ||
        (service.description || '').toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [services, categoryFilter, searchQuery]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Resident Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Services List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold px-4">Available Services</h3>
            
            <div className="px-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  placeholder="Search providers or descriptions..." 
                  className="flex-grow rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setSearchQuery(searchInput)}
                />
                <Button onClick={() => setSearchQuery(searchInput)}>Search</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full"
                >
                  <ServiceCard service={service} onBook={handleBook} />
                </motion.div>
              ))}
              {filteredServices.length === 0 && <p className="text-gray-500 col-span-full">No services found matching your criteria.</p>}
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">My Bookings</h3>
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold capitalize">{booking.serviceId?.category?.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">Provider: {booking.providerId?.name}</p>
                        <p className="text-sm text-gray-500">Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium
                        ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center mt-4">
                      <div className="relative inline-block">
                        <Button variant="outline" size="sm" onClick={() => setActiveChatBooking(booking)}>
                          <MessageSquare className="w-4 h-4 mr-2" /> Chat with Provider
                        </Button>
                        {unreadBookings[booking._id] && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                        )}
                      </div>
                      
                      {booking.status === 'completed' && !booking.rating && (
                        <div className="flex items-center gap-1 border rounded-md px-2 py-1 bg-gray-50">
                          <span className="text-xs text-gray-500 mr-2">Rate:</span>
                          {[1,2,3,4,5].map(star => (
                            <button 
                              key={star} 
                              onClick={() => handleRate(booking._id, star)}
                              className="text-gray-400 hover:text-yellow-500 transition-colors"
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      )}
                      {booking.rating && (
                        <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                          Rated: {booking.rating} ★
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {bookings.length === 0 && <p className="text-gray-500">You have no bookings yet.</p>}
          </div>
        </div>
      </motion.div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={!!activeChatBooking}
        onClose={() => setActiveChatBooking(null)}
        bookingId={activeChatBooking?._id || ''}
        currentUserId={user?._id || ''}
        otherUserName={activeChatBooking?.providerId?.name || 'Provider'}
      />
    </div>
  );
};

export default ResidentDashboard;
