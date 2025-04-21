import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<profileService.BaseProfile | null>(null);
  const [resumes, setResumes] = useState<profileService.Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await profileService.getProfile();
        setProfile(profileData);
        const resumesData = await profileService.getResumes();
        setResumes(resumesData);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      const resume = await profileService.uploadResume(selectedFile);
      setResumes([...resumes, resume]);
      setSelectedFile(null);
    } catch (err) {
      setError('Failed to upload resume');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">First Name</p>
            <p className="font-medium">{profile.first_name}</p>
          </div>
          <div>
            <p className="text-gray-600">Last Name</p>
            <p className="font-medium">{profile.last_name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-medium">{profile.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600">Location</p>
            <p className="font-medium">{profile.location || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumes</h2>
        <div className="mb-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleFileUpload}
            disabled={!selectedFile}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Upload Resume
          </button>
        </div>
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div key={resume.id} className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-medium">Resume uploaded on {new Date(resume.upload_timestamp).toLocaleDateString()}</p>
                <a
                  href={`${import.meta.env.VITE_API_URL}${resume.file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Resume
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Skills & Experience</h2>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Experience</h3>
          <div className="space-y-2">
            {profile.experience?.map((exp, index) => (
              <p key={index} className="text-gray-700">{exp}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 