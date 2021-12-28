const config = {
  // content: ["./src/**/*.{html,js,svelte,ts}"],
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {},
  },

  plugins: [
    require('daisyui'),
  ],

  daisyui: {
    themes: [
      {
        'default-light': {
          'primary': '#0c5bf7',
          'primary-focus': '#0648cc',
          'primary-content': '#ffffff',
          'secondary': '#f000b8',
          'secondary-focus': '#bd0091',
          'secondary-content': '#ffffff',
          'accent': '#37cdbe',
          'accent-focus': '#2aa79b',
          'accent-content': '#ffffff',
          'neutral': '#3d4451',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f2f4f5',
          'base-300': '#d1d5db',
          'base-content': '#1f2937',
          'info': '#2094f3',
          'success': '#00ad45',
          'warning': '#ff9900',
          'error': '#ff291a',
        },
      },
    ],
  },
};

module.exports = config;
