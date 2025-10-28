
import React, { useState, useEffect } from 'react';
import type { Patient } from '../types';

type PatientFormData = Omit<Patient, 'id' | 'userId' | 'healthMetrics' | 'medicationSchedule' | 'alerts' | 'location' | 'symptoms'>;

interface AddPatientFormProps {
  onSubmit: (patientData: PatientFormData) => void;
  onCancel: () => void;
  initialData?: Patient | null;
}

const AddPatientForm: React.FC<AddPatientFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    photoUrl: '',
    primaryCaregiver: '',
    emergencyContact: '',
    conditions: '',
    allergies: '',
    notes: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    if (initialData) {
        setFormData({
            name: initialData.name,
            age: String(initialData.age),
            photoUrl: initialData.photoUrl,
            primaryCaregiver: initialData.primaryCaregiver,
            emergencyContact: initialData.emergencyContact,
            conditions: initialData.conditions || '',
            allergies: initialData.allergies || '',
            notes: initialData.notes || '',
        });
        setImagePreview(initialData.photoUrl);
    } else {
        // Reset form when adding new
        setFormData({
            name: '', age: '', photoUrl: '', primaryCaregiver: '', emergencyContact: '', conditions: '', allergies: '', notes: '',
        });
        setImagePreview(null);
    }
    setErrors({});
  }, [initialData]);
  
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.age || parseInt(formData.age, 10) <= 0) newErrors.age = 'A valid age is required.';
    if (!formData.primaryCaregiver.trim()) newErrors.primaryCaregiver = 'Primary caregiver is required.';
    if (!/\d/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Emergency contact must include a phone number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setFormData(prev => ({ ...prev, photoUrl: result }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ 
          ...formData, 
          age: parseInt(formData.age, 10),
      });
    }
  };
  
  const inputStyles = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-brand-surface-light dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Profile Photo</label>
        <div className="mt-2 flex items-center space-x-4">
            <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                {imagePreview ? (
                    <img className="h-full w-full object-cover" src={imagePreview} alt="Patient preview" />
                ) : (
                    <svg className="h-full w-full text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </span>
            <label htmlFor="photo-upload" className="cursor-pointer bg-brand-surface-light dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark hover:bg-gray-50 dark:hover:bg-gray-800">
                <span>Upload a photo</span>
                <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
            </label>
        </div>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Full Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputStyles} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
       <div>
        <label htmlFor="age" className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Age</label>
        <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required className={inputStyles} />
        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
      </div>
       <div>
        <label htmlFor="primaryCaregiver" className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Primary Caregiver</label>
        <input type="text" id="primaryCaregiver" name="primaryCaregiver" value={formData.primaryCaregiver} onChange={handleChange} required className={inputStyles} placeholder="e.g., Sarah Vance (Daughter)"/>
       {errors.primaryCaregiver && <p className="text-red-500 text-xs mt-1">{errors.primaryCaregiver}</p>}
      </div>
       <div>
        <label htmlFor="emergencyContact" className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Emergency Contact</label>
        <input type="text" id="emergencyContact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required className={inputStyles} placeholder="Dr. Miller - (555) 123-4567" />
        {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
      </div>
      <div>
        <label htmlFor="conditions" className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Chronic Conditions</label>
        <input type="text" id="conditions" name="conditions" value={formData.conditions} onChange={handleChange} className={inputStyles} placeholder="e.g., Hypertension, Diabetes"/>
      </div>
      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Allergies</label>
        <input type="text" id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} className={inputStyles} placeholder="e.g., Penicillin, Nuts"/>
      </div>
       <div>
        <label htmlFor="notes" className="block text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Caregiver Notes</label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputStyles} placeholder="Any important information..."/>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 dark:bg-gray-600 text-brand-text-primary dark:text-brand-text-primary_dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">
          Cancel
        </button>
        <button type="submit" className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition">
          {initialData ? 'Save Changes' : 'Add Patient'}
        </button>
      </div>
    </form>
  );
};

export default AddPatientForm;
