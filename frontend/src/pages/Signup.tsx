import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { fetchAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'resident' | 'serviceProvider'>('resident');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, name, role }),
      });
      login(data);
      navigate(data.role === 'resident' ? '/resident' : '/provider');
    } catch (error) {
      console.error(error);
      alert('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-3xl font-bold text-center tracking-tight">Create an account</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your information to get started
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer text-center transition-colors ${role === 'resident' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-primary/50'}`}
                    onClick={() => setRole('resident')}
                  >
                    <span className="font-medium text-sm">Resident</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer text-center transition-colors ${role === 'serviceProvider' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-primary/50'}`}
                    onClick={() => setRole('serviceProvider')}
                  >
                    <span className="font-medium text-sm">Provider</span>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-lg text-md py-6 mt-4" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
