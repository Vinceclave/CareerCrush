import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, EmployeeProfile } from '../../services/profileService';

export default function EmployeeProfileForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [profile, setProfile] = useState<Partial<EmployeeProfile>>({
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',
    title: '',
    skills: [],
    experience_years: 0,
    education: '',
    resume_url: '',
    linkedin_url: '',
    github_url: '',
    bio: '',
    preferred_location: '',
    preferred_job_type: 'full-time',
    preferred_work_environment: 'hybrid'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const existingProfile = await profileService.getProfile();
      if (profileService.isEmployeeProfile(existingProfile)) {
        setProfile(existingProfile);
      }
    } catch (error) {
      // Profile might not exist yet, which is fine
      console.log('No existing profile found');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'skills' ? value.split(',').map(skill => skill.trim()) : 
              name === 'experience_years' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (profile.id) {
        await profileService.updateProfile(profile);
      } else {
        await profileService.createProfile(profile);
      }
      navigate('/employee/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Employee Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              value={profile.first_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              required
              value={profile.last_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
              Profile Picture URL
            </label>
            <input
              type="url"
              id="avatar_url"
              name="avatar_url"
              value={profile.avatar_url || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Professional Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={profile.title || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills (comma-separated) *
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            required
            value={profile.skills?.join(', ') || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="e.g., JavaScript, React, Node.js"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              id="experience_years"
              name="experience_years"
              min="0"
              value={profile.experience_years || 0}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <input
              type="text"
              id="education"
              name="education"
              value={profile.education || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="e.g., BS in Computer Science"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="resume_url" className="block text-sm font-medium text-gray-700">
              Resume URL
            </label>
            <input
              type="url"
              id="resume_url"
              name="resume_url"
              value={profile.resume_url || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              value={profile.linkedin_url || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="github_url" className="block text-sm font-medium text-gray-700">
            GitHub Profile
          </label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={profile.github_url || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="https://github.com/..."
          />
        </div>

        {/* Additional Information */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={profile.bio || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="preferred_location" className="block text-sm font-medium text-gray-700">
              Preferred Location
            </label>
            <input
              type="text"
              id="preferred_location"
              name="preferred_location"
              value={profile.preferred_location || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div>
            <label htmlFor="preferred_job_type" className="block text-sm font-medium text-gray-700">
              Preferred Job Type
            </label>
            <select
              id="preferred_job_type"
              name="preferred_job_type"
              value={profile.preferred_job_type || 'full-time'}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="preferred_work_environment" className="block text-sm font-medium text-gray-700">
            Preferred Work Environment
          </label>
          <select
            id="preferred_work_environment"
            name="preferred_work_environment"
            value={profile.preferred_work_environment || 'hybrid'}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
} 