import './index-builder.scss';
import './avatar-builder.js';
import manifestData from '../../../../cata_manifest_handoff.json';

function displayAvatar() {
  const avatar = manifestData.avatar;
  const avatarImage = document.getElementById('avatar-image');
  const avatarDetails = document.getElementById('avatar-details');
  
  if (avatarImage && avatarDetails) {
    avatarImage.src = avatar.filePath;
    
    avatarDetails.innerHTML = `
      <li><strong>ID:</strong> ${avatar.id}</li>
      <li><strong>File Path:</strong> ${avatar.filePath}</li>
      <li><strong>Width:</strong> ${avatar.width}px</li>
      <li><strong>Height:</strong> ${avatar.height}px</li>
      <li><strong>Anchor X:</strong> ${avatar.anchorX}</li>
      <li><strong>Anchor Y:</strong> ${avatar.anchorY}</li>
    `;
    
    avatarImage.style.width = '200px';
    avatarImage.style.height = 'auto';
    avatarImage.style.transformOrigin = `${avatar.anchorX * 100}% ${avatar.anchorY * 100}%`;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayAvatar);
} else {
  displayAvatar();
}