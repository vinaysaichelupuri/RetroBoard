import React, { useState } from "react";
import { Settings, Plus, X, Save, SortAsc, SortDesc,Pencil, Check ,X as Close , Info} from "lucide-react";
import { Room, CustomField } from "../types";

interface CreatorControlsProps {
  room: Room;
  onUpdateRoom: (updates: Partial<Room>) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export const CreatorControls: React.FC<CreatorControlsProps> = ({
  room,
  onUpdateRoom,
  isVisible,
  onToggle,
}) => {
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    required: false,
  });
  const [showAddField, setShowAddField] = useState(false);
    const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState(room.name);

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== room.name) {
      onUpdateRoom({ name: editedName.trim() });
    }
    setEditingName(false);
  };

  const handleAddCustomField = () => {
    if (!newField.name?.trim()) return;

    const field: CustomField = {
      id: `field_${Date.now()}`,
      name: newField.name.trim(),
      type: newField.type || "text",
      required: newField.required || false,
      ...(newField.type === "select" && newField.options
        ? { options: newField.options }
        : {}),
    };

    onUpdateRoom({
      customFields: [...room.customFields, field],
    });

    setNewField({ name: "", type: "text", required: false });
    setShowAddField(false);
  };

  const handleRemoveField = (fieldId: string) => {
    onUpdateRoom({
      customFields: room.customFields.filter((f) => f.id !== fieldId),
    });
  };

  const handleSortChange = (sortBy: "timestamp" | "votes" | "author") => {
    const newOrder =
      room.settings.sortBy === sortBy && room.settings.sortOrder === "desc"
        ? "asc"
        : "desc";

    onUpdateRoom({
      settings: {
        ...room.settings,
        sortBy,
        sortOrder: newOrder,
      },
    });
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 z-50"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Creator Controls
            </h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
             {/* Board Name Editable */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board Name
            </label>
            <div className="flex items-center space-x-2">
              {editingName ? (
                <>
                  <input
                    type="text"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setEditedName(room.name); }}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Close className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xl font-semibold text-gray-900">{room.name}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Sorting Controls */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sort Cards
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "timestamp", label: "Time" },
                { key: "votes", label: "Likes" },
                { key: "author", label: "Author" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSortChange(key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    room.settings.sortBy === key
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{label}</span>
                  {room.settings.sortBy === key &&
                    (room.settings.sortOrder === "desc" ? (
                      <SortDesc className="w-4 h-4" />
                    ) : (
                      <SortAsc className="w-4 h-4" />
                    ))}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Custom Fields
              </h3>
              <button
                onClick={() => setShowAddField(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </button>
            </div>

            {/* Existing Fields */}
            <div className="space-y-2 mb-4">
              {room.customFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      {field.name}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({field.type})
                    </span>
                    {field.required && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Field Form */}
            {showAddField && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={newField.name || ""}
                    onChange={(e) =>
                      setNewField({ ...newField, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter field name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Type
                  </label>
                  <select
                    value={newField.type || "text"}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                  </select>
                </div>

                {newField.type === "select" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          options: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={newField.required || false}
                    onChange={(e) =>
                      setNewField({ ...newField, required: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="required" className="text-sm text-gray-700">
                    Required field
                  </label>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleAddCustomField}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Add Field</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddField(false);
                      setNewField({ name: "", type: "text", required: false });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Room Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Room Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">
                    Show Authors to Creator
                  </span>
                  <p className="text-sm text-gray-500">
                    You can see who created each card
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={room.settings.showAuthorToCreator}
                  onChange={(e) =>
                    onUpdateRoom({
                      settings: {
                        ...room.settings,
                        showAuthorToCreator: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">
                    Allow Anonymous Cards
                  </span>
                  <p className="text-sm text-gray-500">
                    Users can add cards without showing their name
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={room.settings.allowAnonymousCards}
                  onChange={(e) =>
                    onUpdateRoom({
                      settings: {
                        ...room.settings,
                        allowAnonymousCards: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">
                    Timer for Voting
                  </span>
                  <p className="text-sm text-gray-500">
                    Enable a countdown during voting.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={room.settings.showTimerVoting}
                  onChange={(e) => {
                    onUpdateRoom({
                      settings: {
                        ...room.settings,
                        showTimerVoting: e.target.checked,
                      },
                    });
                  }}
                  className="w-4 h-4 text-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
