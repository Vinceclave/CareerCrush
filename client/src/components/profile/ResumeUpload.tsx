import { useState } from 'react';
import { profileService } from '../../services/profileService';

interface ResumeUploadProps {
  onUploadSuccess: (url: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { fileUrl } = await profileService.uploadResume(file);
      onUploadSuccess(fileUrl);
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Resume</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resume File
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Upload your resume in PDF or Word format (max 5MB)
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {file && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Resume'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload; 