import { useEffect, useState } from 'react';
import { fetchAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { ChatModal } from '../components/ChatModal';
import { useAuthStore } from '../store/authStore';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ProviderDashboard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [category, setCategory] = useState('plumber');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Service Edit states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Chat states
  const [activeChatBooking, setActiveChatBooking] = useState<any | null>(null);
  const [unreadBookings, setUnreadBookings] = useState<Record<string, boolean>>({});
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

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
        fetchAPI('/services/provider'),
        fetchAPI('/bookings/provider'),
      ]);
      setServices(servicesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI('/services', {
        method: 'POST',
        body: JSON.stringify({ category, description, price }),
      });
      fetchData();
      setDescription('');
      setPrice('');
      alert('Service created!');
    } catch (error) {
      console.error(error);
      alert('Failed to create service');
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    try {
      await fetchAPI(`/services/${serviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ category: editCategory, price: editPrice, description: editDescription }),
      });
      fetchData();
      setEditingServiceId(null);
      alert('Service Updated Successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update service');
    }
  };

  const handleUpdateBooking = async (bookingId: string, status: string) => {
    try {
      await fetchAPI(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to update booking');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Provider Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manage Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">My Services</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="laundry">Laundry</option>
                      <option value="milk_delivery">Milk Delivery</option>
                      <option value="house_cleaning">House Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="E.g., Expert fixing leaks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <Input
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="E.g., 50/hr or 100/visit"
                    />
                  </div>
                  <Button type="submit">Create Service</Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4 mt-6">
              <h4 className="font-medium text-gray-700">Manage My Services</h4>
              {services.map((service, i) => (
                <motion.div key={service._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card>
                    <CardContent className="pt-6">
                      {editingServiceId === service._id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <option value="plumber">Plumber</option>
                              <option value="electrician">Electrician</option>
                              <option value="laundry">Laundry</option>
                              <option value="milk_delivery">Milk Delivery</option>
                              <option value="house_cleaning">House Cleaning</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                            <Input
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                            <Input
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={() => handleUpdateService(service._id)}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingServiceId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold capitalize">{service.category.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600 mb-1">{service.description}</p>
                            <p className="text-sm font-medium bg-gray-100 inline-block px-2 py-1 rounded">Price: {service.price}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingServiceId(service._id);
                              setEditCategory(service.category);
                              setEditPrice(service.price);
                              setEditDescription(service.description);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Incoming Bookings */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Incoming Requests</h3>
            {bookings.map((booking, i) => (
              <motion.div key={booking._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold capitalize">{booking.serviceId?.category?.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">From: {booking.residentId?.name}</p>
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
                      
                      {booking.status === 'pending' && (
                        <div className="flex space-x-2 pt-2 border-t border-gray-100">
                          <Button size="sm" onClick={() => handleUpdateBooking(booking._id, 'accepted')} className="bg-green-600 hover:bg-green-700">Accept</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpdateBooking(booking._id, 'rejected')}>Reject</Button>
                        </div>
                      )}
                      
                      {booking.status === 'accepted' && (
                        <div className="flex space-x-2 pt-2 border-t border-gray-100">
                          <Button size="sm" onClick={() => handleUpdateBooking(booking._id, 'completed')} className="bg-blue-600 hover:bg-blue-700">Mark Completed</Button>
                        </div>
                      )}

                      <div className="relative inline-block self-start">
                        <Button variant="outline" size="sm" onClick={() => setActiveChatBooking(booking)}>
                          <MessageSquare className="w-4 h-4 mr-2" /> Chat with Resident
                        </Button>
                        {unreadBookings[booking._id] && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {bookings.length === 0 && <p className="text-gray-500">No incoming requests.</p>}
          </div>
        </div>
      </motion.div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={!!activeChatBooking}
        onClose={() => setActiveChatBooking(null)}
        bookingId={activeChatBooking?._id || ''}
        currentUserId={user?._id || ''}
        otherUserName={activeChatBooking?.residentId?.name || 'Resident'}
      />
    </div>
  );
};

export default ProviderDashboard;
