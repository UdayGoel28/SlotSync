"use client";

import { useState } from "react";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description: string | null;
  isActive: boolean;
};

export function ServiceSelector({ services }: { services: Service[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeServices = services.filter(s => s.isActive);

  if (activeServices.length === 0) {
    return (
      <div>
        <label className="block text-sm font-medium mb-2">Select a Service</label>
        <div className="p-4 text-center border rounded-lg bg-slate-50 text-muted-foreground text-sm">
          No services are currently available for booking.
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select a Service</label>
      <div className="space-y-2">
        {activeServices.map(service => (
          <div 
            key={service.id}
            onClick={() => setSelectedId(service.id)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${
              selectedId === service.id 
                ? 'border-brand-600 bg-brand-50' 
                : 'hover:border-brand-400 bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm text-slate-900">{service.name}</p>
                {service.description && (
                  <p className="text-xs text-slate-500 mt-1">{service.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">${service.price}</p>
                <p className="text-xs text-slate-500 mt-1">{service.durationMinutes} mins</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
