import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { RetroCard, CustomField } from '../types';

interface CardEditModalProps {
  card: RetroCard;
  customFields: CustomField[];
  onSave: (updates: Partial<RetroCard>) => void;
  onClose: () => void;
}

export const CardEditModal: React.FC<CardEditModalProps> = ({
  card,
  customFields,
  onSave,
  onClose
}) => {
  const [text, setText] = useState(card.text);
  const [category, setCategory] = useState(card.category);
  const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: string }>(
    card.customFields || {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fieldValues = customFields.length > 0 ? 
      Object.fromEntries(
        customFields.map(field => [field.name, customFieldValues[field.name] || ''])
      ) : card.customFields;

    onSave({
      text: text.trim(),
      category,
      customFields: fieldValues
    });
    
    onClose();
  };

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const categoryOptions = [
    { value: 'start', label: 'Start', color: 'bg-green-500 hover:bg-green-600' },
    { value: 'stop', label: 'Stop', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'continue', label: 'Continue', color: 'bg-blue-500 hover:bg-blue-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Card</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex space-x-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCategory(option.value as any)}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
                    category === option.value ? option.color : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              required
            />
          </div>

          {/* Custom Fields */}
          {customFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={customFieldValues[field.name] || ''}
                  onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.required}
                />
              )}
              
              {field.type === 'number' && (
                <input
                  type="number"
                  value={customFieldValues[field.name] || ''}
                  onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.required}
                />
              )}
              
              {field.type === 'select' && field.options && (
                <select
                  value={customFieldValues[field.name] || ''}
                  onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.required}
                >
                  <option value="">Select an option</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};