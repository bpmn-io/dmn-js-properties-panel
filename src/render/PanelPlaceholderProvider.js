export const PanelPlaceholderProvider = {

  getEmpty: () => {
    return {
      text: 'Select an element to edit its properties.',

      // todo(pinussilvestrus): add icon
      icon: null
    };
  },

  getMultiple: () => {
    return {
      text: 'Multiple elements are selected. Select a single element to edit its properties.',

      // todo(pinussilvestrus): add icon
      icon: null
    };
  },
};