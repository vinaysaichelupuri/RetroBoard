import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { CustomField } from '../types';

interface AddCardFormProps {
  onAddCard: (text: string, category: 'start' | 'stop' | 'continue', customFields?: { [key: string]: string }) => void;
  userName: string;
  customFields?: CustomField[];
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ onAddCard, userName, customFields = [] }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'start' | 'stop' | 'continue'>('start');
  const [isExpanded, setIsExpanded] = useState(false);
  const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      // Validate required custom fields
      const missingRequired = customFields.filter(field => 
        field.required && !customFieldValues[field.id]?.trim()
      );
      
      if (missingRequired.length > 0) {
        alert(`Please fill in required fields: ${missingRequired.map(f => f.name).join(', ')}`);
        return;
      }
      
      const fieldValues = customFields.length > 0 ? 
        Object.fromEntries(
          customFields.map(field => [field.name, customFieldValues[field.id] || ''])
        ) : undefined;
      
      onAddCard(text.trim(), category, fieldValues);
      setText('');
      setCustomFieldValues({});
      setIsExpanded(false);
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };
  const categoryOptions = [
    { value: 'Went well', label: 'Went well', color: 'bg-green-500 hover:bg-green-600' },
    { value: 'Not went well', label: 'Not went well', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'Action items', label: 'Action items', color: 'bg-blue-500 hover:bg-blue-600' }
  ];

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg"
      >
        <Plus className="w-5 h-5" />
        <span>Add Retro Card</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex space-x-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCategory(option.value as 'start' | 'stop' | 'continue')}
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
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Your thoughts
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What would you like to share?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            rows={3}
            required
            autoFocus
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
                value={customFieldValues[field.id] || ''}
                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={field.required}
              />
            )}
            
            {field.type === 'number' && (
              <input
                type="number"
                value={customFieldValues[field.id] || ''}
                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={field.required}
              />
            )}
            
            {field.type === 'select' && field.options && (
              <select
                value={customFieldValues[field.id] || ''}
                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
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
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
          >
            <Send className="w-4 h-4" />
            <span>Add Card</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setText('');
              setCustomFieldValues({});
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};