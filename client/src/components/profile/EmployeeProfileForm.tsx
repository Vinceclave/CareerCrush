import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService, EmployeeProfile } from '../../services/profileService';
import ResumeUpload from './ResumeUpload';

const EmployeeProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
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
      console.log('No existing profile found');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfile(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (profile.id) {
        await profileService.updateProfile(profile);
      } else {
        await profileService.createProfile(profile);
      }
      setSuccess('Profile saved successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Employee Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Professional Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={profile.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={profile.skills?.join(', ')}
            onChange={handleSkillsChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">
            Years of Experience
          </label>
          <input
            type="number"
            id="experience_years"
            name="experience_years"
            value={profile.experience_years}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700">
            Education
          </label>
          <textarea
            id="education"
            name="education"
            value={profile.education}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="preferred_location" className="block text-sm font-medium text-gray-700">
            Preferred Location
          </label>
          <input
            type="text"
            id="preferred_location"
            name="preferred_location"
            value={profile.preferred_location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      <ResumeUpload onUploadSuccess={(url) => {
        setProfile(prev => ({ ...prev, resume_url: url }));
        setSuccess('Resume uploaded successfully');
      }} />
    </div>
  );
};

export default EmployeeProfileForm;