
import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { CustomField } from '../types';

interface AddCardFormProps {
  category: 'start' | 'stop' | 'continue';
  onAddCard: (
    text: string,
    category: 'start' | 'stop' | 'continue',
    customFields?: { [key: string]: string }
  ) => void;
  userName: string;
  customFields?: CustomField[];
}

export const AddCardForm: React.FC<AddCardFormProps> = ({
  onAddCard,
  userName,
  customFields = [],
  category,
}) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const missingRequired = customFields.filter(
        (field) => field.required && !customFieldValues[field.id]?.trim()
      );

      if (missingRequired.length > 0) {
        alert(`Please fill in required fields: ${missingRequired.map((f) => f.name).join(', ')}`);
        return;
      }

      const fieldValues =
        customFields.length > 0
          ? Object.fromEntries(
              customFields.map((field) => [field.name, customFieldValues[field.id] || ''])
            )
          : undefined;

      onAddCard(text.trim(), category, fieldValues);
      setText('');
      setCustomFieldValues({});
      setIsExpanded(false);
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-gray-100 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center text-sm text-gray-600 font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add card
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What would you like to share?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          required
          autoFocus
        />

        {/* Custom Fields */}
        {customFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                value={customFieldValues[field.id] || ''}
                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                value={customFieldValues[field.id] || ''}
                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
            )}

            {field.type === 'select' && field.options && (
              <select
                value={customFieldValues[field.id] || ''}
                onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              setText('');
              setCustomFieldValues({});
            }}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

