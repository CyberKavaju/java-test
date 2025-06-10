import React, { useState } from 'react';
import { apiService } from '../services/api';
import './Import.css';

interface ImportPreview {
  valid: Array<{
    domain: string;
    topic: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d?: string;
    option_e?: string;
    correct_answer: string;
    explanation: string;
  }>;
  duplicates: Array<{
    rowIndex: number;
    question_text: string;
    reason: string;
  }>;
  errors: Array<{
    rowIndex: number;
    errors: string[];
  }>;
}

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: number;
  message: string;
  details?: {
    importedQuestions: number;
    skippedDuplicates: number;
    errorRows: Array<{
      rowIndex: number;
      errors: string[];
    }>;
  };
}

const Import: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setPreview(null);
      setResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const previewData = await apiService.previewImport(formData);
      setPreview(previewData);
    } catch (error) {
      console.error('Preview failed:', error);
      alert('Failed to preview file. Please check the format and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const importResult = await apiService.importQuestions(formData);
      setResult(importResult);
      setPreview(null);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="import-container">
      <h1>Import Questions from CSV</h1>
      
      <div className="import-section">
        <h2>File Selection</h2>
        <div 
          className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="drop-zone-content">
            <p>Drag and drop your CSV file here, or click to select</p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" className="file-select-btn">
              Select CSV File
            </label>
          </div>
        </div>
        
        {file && (
          <div className="file-info">
            <p><strong>Selected file:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>

      <div className="csv-format-info">
        <h3>Expected CSV Format</h3>
        <p>Your CSV file should have the following columns:</p>
        <code>
          domain,topic,question_text,option_a,option_b,option_c,option_d,option_e,correct_answer,explanation
        </code>
        <p><small>Note: option_d and option_e are optional</small></p>
        
        <div className="format-features">
          <h4>✨ Auto-Formatting Features</h4>
          <ul>
            <li>📝 <strong>Question Text:</strong> Proper code block formatting with ```java``` syntax</li>
            <li>🔢 <strong>Multi-part Questions:</strong> Line breaks after question marks</li>
            <li>📋 <strong>Instructions:</strong> Clear formatting for "(Select X options)" text</li>
            <li>💡 <strong>Explanations:</strong> Sentence breaks and code reference formatting</li>
            <li>🎯 <strong>Java Exceptions:</strong> Automatic backtick formatting for exception names</li>
          </ul>
          <p className="format-note">
            <em>All questions are automatically formatted for better readability during import!</em>
          </p>
        </div>
      </div>

      {file && !preview && !result && (
        <div className="action-buttons">
          <button 
            onClick={handlePreview} 
            disabled={loading}
            className="preview-btn"
          >
            {loading ? 'Analyzing...' : 'Preview Import'}
          </button>
        </div>
      )}

      {preview && (
        <div className="preview-section">
          <h2>Import Preview</h2>
          
          <div className="preview-summary">
            <div className="summary-card valid">
              <h3>Valid Questions</h3>
              <p className="count">{preview.valid.length}</p>
            </div>
            <div className="summary-card duplicates">
              <h3>Duplicates Found</h3>
              <p className="count">{preview.duplicates.length}</p>
            </div>
            <div className="summary-card errors">
              <h3>Errors Found</h3>
              <p className="count">{preview.errors.length}</p>
            </div>
          </div>

          {preview.duplicates.length > 0 && (
            <div className="duplicates-section">
              <h3>Duplicate Questions (will be skipped)</h3>
              <div className="duplicates-list">
                {preview.duplicates.map((duplicate, index) => (
                  <div key={index} className="duplicate-item">
                    <p><strong>Row {duplicate.rowIndex + 1}:</strong> {duplicate.reason}</p>
                    <p className="question-preview">{duplicate.question_text.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {preview.errors.length > 0 && (
            <div className="errors-section">
              <h3>Errors (will be skipped)</h3>
              <div className="errors-list">
                {preview.errors.map((error, index) => (
                  <div key={index} className="error-item">
                    <p><strong>Row {error.rowIndex + 1}:</strong></p>
                    <ul>
                      {error.errors.map((err, errIndex) => (
                        <li key={errIndex}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="valid-preview">
            <h3>Sample Valid Questions</h3>
            <div className="questions-preview">
              {preview.valid.slice(0, 3).map((question, index) => (
                <div key={index} className="question-preview-item">
                  <p><strong>Domain:</strong> {question.domain}</p>
                  <p><strong>Topic:</strong> {question.topic}</p>
                  <p><strong>Question:</strong> {question.question_text.substring(0, 150)}...</p>
                  <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
                </div>
              ))}
              {preview.valid.length > 3 && (
                <p>... and {preview.valid.length - 3} more questions</p>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleImport} 
              disabled={loading || preview.valid.length === 0}
              className="import-btn"
            >
              {loading ? 'Importing...' : `Import ${preview.valid.length} Questions`}
            </button>
            <button onClick={resetImport} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="result-section">
          <h2>Import Results</h2>
          
          <div className={`result-summary ${result.success ? 'success' : 'error'}`}>
            <h3>{result.success ? 'Import Successful!' : 'Import Completed with Issues'}</h3>
            <p>{result.message}</p>
            
            <div className="result-stats">
              <div className="stat">
                <span className="label">Imported:</span>
                <span className="value">{result.imported}</span>
              </div>
              <div className="stat">
                <span className="label">Skipped:</span>
                <span className="value">{result.skipped}</span>
              </div>
              <div className="stat">
                <span className="label">Errors:</span>
                <span className="value">{result.errors}</span>
              </div>
            </div>
          </div>

          {result.details?.errorRows && result.details.errorRows.length > 0 && (
            <div className="error-details">
              <h3>Error Details</h3>
              {result.details.errorRows.map((error, index) => (
                <div key={index} className="error-detail">
                  <p><strong>Row {error.rowIndex + 1}:</strong></p>
                  <ul>
                    {error.errors.map((err, errIndex) => (
                      <li key={errIndex}>{err}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="action-buttons">
            <button onClick={resetImport} className="reset-btn">
              Import Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Import;
