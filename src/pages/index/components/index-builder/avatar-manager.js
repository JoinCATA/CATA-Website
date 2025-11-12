import manifestData from '../../../cata_manifest_handoff.json';
class AvatarManager {
  constructor() {
    this.avatarData = manifestData.avatar;
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.render());
    } else {
      this.render();
    }
  }
  
  render() {
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarInfo = document.querySelector('.avatar-info');
    
    if (avatarContainer && avatarInfo) {
      this.createAvatarImage(avatarContainer);
      this.fillAvatarInfo(avatarInfo);
    } else {
    }
  }
  
  createAvatarImage(container) {
    const img = document.createElement('img');
    img.id = 'avatar-image';
    img.className = 'avatar-image';
    img.src = this.avatarData.filePath;
    img.alt = `Avatar ${this.avatarData.id}`;
    
    img.style.maxWidth = '250px';
    img.style.height = 'auto';
    img.style.transformOrigin = `${this.avatarData.anchorX * 100}% ${this.avatarData.anchorY * 100}%`;
    
    img.onload = () => {
      img.style.opacity = '1';
    };
    
    img.onerror = () => {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPiA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxOHB4IiBmaWxsPSIjOTk5Ij5BdmF0YXI8L3RleHQ+IDwvc3ZnPg==';
    };
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    container.appendChild(img);
  }
  
  fillAvatarInfo(container) {
    const avatar = this.avatarData;
    
    container.innerHTML = `
      <h3>📋 Avatar Information</h3>
      <ul id="avatar-details">
        <li><strong>ID:</strong> <span class="value">${avatar.id}</span></li>
        <li><strong>File Path:</strong> <span class="value">${avatar.filePath}</span></li>
        <li><strong>Dimensions:</strong> <span class="value">${avatar.width} × ${avatar.height} px</span></li>
        <li><strong>Aspect Ratio:</strong> <span class="value">${(avatar.width / avatar.height).toFixed(2)}</span></li>
        <li><strong>Anchor X:</strong> <span class="value">${avatar.anchorX} (${(avatar.anchorX * 100).toFixed(1)}%)</span></li>
        <li><strong>Anchor Y:</strong> <span class="value">${avatar.anchorY} (${(avatar.anchorY * 100).toFixed(1)}%)</span></li>
        <li><strong>Anchor Position:</strong> <span class="value">${this.getAnchorPositionName()}</span></li>
      </ul>
      <div class="avatar-json">
        <h4>🔧 Raw JSON:</h4>
        <pre>${JSON.stringify(avatar, null, 2)}</pre>
      </div>
    `;
  }
  
  getAnchorPositionName() {
    const { anchorX, anchorY } = this.avatarData;
    
    if (anchorX === 0.5 && anchorY === 0) return 'Top Center';
    if (anchorX === 0.5 && anchorY === 0.5) return 'Center';
    if (anchorX === 0.5 && anchorY === 1.0) return 'Bottom Center';
    if (anchorX === 0 && anchorY === 0) return 'Top Left';
    if (anchorX === 1.0 && anchorY === 0) return 'Top Right';
    if (anchorX === 0 && anchorY === 1.0) return 'Bottom Left';
    if (anchorX === 1.0 && anchorY === 1.0) return 'Bottom Right';
    
    return `Custom (${anchorX}, ${anchorY})`;
  }
  
  getAvatarData() {
    return this.avatarData;
  }
}
const avatarManager = new AvatarManager();

export default avatarManager;
export { AvatarManager };