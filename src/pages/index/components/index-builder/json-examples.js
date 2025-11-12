
import manifestData from '../../../cata_manifest_handoff.json';

async function loadJSONWithFetch() {
  try {
    const response = await fetch('/assets/cata_manifest_handoff.json');
    const data = await response.json();
    return data;
  } catch (error) {
    // error handling
  }
}

async function loadJSONDynamically() {
  try {
    const module = await import('../../../cata_manifest_handoff.json');
    const data = module.default;
    return data;
  } catch (error) {
    // error handling
  }
}


export function getCategories() {
  return manifestData.categories;
}


export function getItemsByCategory(categoryId) {
  return manifestData.items.filter(item => item.category === categoryId);
}

export function getPresetByName(presetName) {
  return manifestData.ui.presets.find(preset => preset.name === presetName);
}


export function getUISettings() {
  return manifestData.ui;
}


export function getRules() {
  return manifestData.rules;
}




export { manifestData };
export default manifestData;