import React from 'react';
import { Modal } from './ui/Modal';
import { useGlobalModal } from '../contexts/GlobalModalContext';
import { useLanguageContext } from '../contexts';
import { LANGUAGE_OPTIONS } from '../constants';

export const GlobalModals: React.FC = () => {
  const { languageModal, hideLanguageModal } = useGlobalModal();
  const { translations, setLanguage, language } = useLanguageContext();

  if (!languageModal.open) return null;

  return (
    <Modal
      isOpen={languageModal.open}
      onClose={() => {}}
      title={translations.auth.chooseLanguageTitle}
    >
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <p style={{ marginBottom: 24 }}>
          {translations.auth.chooseLanguageExplanation}
        </p>
        <div className="auth-select-wrapper" style={{ marginBottom: 24 }}>
          <label className="auth-input-label" htmlFor="language-select">
            {translations.language.selectLanguage}
          </label>
          <select
            id="language-select"
            className="auth-select"
            value={language}
            onChange={e => setLanguage(e.target.value as 'en' | 'vi')}
          >
            {LANGUAGE_OPTIONS.map(option => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="auth-submit-btn"
          style={{ width: '100%' }}
          onClick={() => {
            if (languageModal.onConfirm) languageModal.onConfirm(language);
            hideLanguageModal();
          }}
        >
          {translations.auth.chooseLanguageConfirm}
        </button>
      </div>
    </Modal>
  );
};
