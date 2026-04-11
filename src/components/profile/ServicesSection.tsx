"use client";

import { useState } from "react";
import {
  Clock,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Sparkles,
} from "lucide-react";
import type { Service } from "@/data/profileTypes";

interface ServicesSectionProps {
  services: Service[];
  isOwner: boolean;
}

export default function ServicesSection({ services, isOwner }: ServicesSectionProps) {
  const [editing, setEditing] = useState(false);
  const [localServices, setLocalServices] = useState(services);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    title: "",
    description: "",
    price: 0,
    currency: "USD",
    duration: "",
  });

  const addService = () => {
    if (newService.title && newService.description) {
      setLocalServices([
        ...localServices,
        {
          id: `s-new-${Date.now()}`,
          title: newService.title || "",
          description: newService.description || "",
          price: newService.price || 0,
          currency: "USD",
          duration: newService.duration || "60 min",
        },
      ]);
      setNewService({ title: "", description: "", price: 0, currency: "USD", duration: "" });
      setShowAddForm(false);
    }
  };

  const removeService = (id: string) => {
    setLocalServices(localServices.filter((s) => s.id !== id));
  };

  // Gradient accents for cards
  const gradients = [
    "from-teal-500 to-emerald-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-indigo-500",
    "from-amber-500 to-orange-500",
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Services & Pricing</h2>
        {isOwner && (
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
          >
            {editing ? <Save size={13} /> : <Edit3 size={13} />}
            {editing ? "Done" : "Manage"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {localServices.map((service, i) => (
          <div
            key={service.id}
            className="relative border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            {/* Top accent bar */}
            <div
              className={`absolute top-0 left-5 right-5 h-0.5 bg-gradient-to-r ${
                gradients[i % gradients.length]
              } rounded-b-full`}
            />

            <h3 className="text-sm font-bold text-gray-900 mb-2 pr-6">
              {service.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-lg font-bold text-teal-700">
                  <DollarSign size={16} />
                  {service.price}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {service.duration}
                </span>
              </div>
              {!isOwner && (
                <button className="px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg hover:bg-teal-100 transition-colors">
                  Book Now
                </button>
              )}
            </div>

            {/* Delete button in edit mode */}
            {editing && (
              <button
                onClick={() => removeService(service.id)}
                className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add service form (owner only) */}
      {editing && !showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-teal-200 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors"
        >
          <Plus size={16} />
          Add New Service
        </button>
      )}

      {showAddForm && (
        <div className="mt-4 border border-gray-200 rounded-xl p-5 space-y-3 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <Sparkles size={14} className="text-teal-600" />
            New Service
          </h4>
          <input
            type="text"
            placeholder="Service title..."
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
          />
          <textarea
            placeholder="Description..."
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none bg-white"
          />
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Price (USD)"
              value={newService.price || ""}
              onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
              className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
            />
            <input
              type="text"
              placeholder="Duration (e.g. 60 min)"
              value={newService.duration}
              onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
              className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addService}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-white font-semibold bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus size={14} />
              Add Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
