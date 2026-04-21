import { Card, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';

import laundryImg from '../assets/laundry.png';
import milkImg from '../assets/milk.avif';
import electricianImg from '../assets/electrician-facts.jpg';
import plumberImg from '../assets/master-plumber.jpg';
import cleaningImg from '../assets/house cleaning.jpg';

const imageMap: Record<string, string> = {
  'laundry': laundryImg,
  'milk_delivery': milkImg,
  'milk': milkImg,
  'electrician': electricianImg,
  'plumber': plumberImg,
  'house_cleaning': cleaningImg,
};

interface ServiceCardProps {
  service: {
    _id: string;
    category: string;
    description: string;
    price: string;
  };
  onBook: (serviceId: string) => void;
}

export const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const categoryKey = service.category.toLowerCase();
  
  // Try to find a matching image, fallback to milkImg if category doesn't strictly match
  let imgSrc = imageMap[categoryKey];
  if (!imgSrc) {
    if (categoryKey.includes('plumb')) imgSrc = plumberImg;
    else if (categoryKey.includes('electric')) imgSrc = electricianImg;
    else if (categoryKey.includes('laundry') || categoryKey.includes('clean')) imgSrc = laundryImg;
    else imgSrc = milkImg;
  }

  return (
    <Card className="h-full w-full max-w-md mx-auto overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg border-gray-100 shadow-md">
      <div className="relative h-48 w-full overflow-hidden group shrink-0">
        <img 
          src={imgSrc} 
          alt={service.category} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <CardTitle className="capitalize text-2xl font-bold tracking-tight text-white mb-1">
            {service.category.replace('_', ' ')}
          </CardTitle>
          <span className="inline-block bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm">
            {service.price}
          </span>
        </div>
      </div>
      <CardContent className="p-5 flex flex-col flex-1 bg-white">
        <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
          {service.description}
        </p>
        <Button onClick={() => onBook(service._id)} className="w-full rounded-lg font-medium shadow-sm hover:shadow">
          Book Service
        </Button>
      </CardContent>
    </Card>
  );
};
