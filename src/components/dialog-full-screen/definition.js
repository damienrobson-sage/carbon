import DialogFullScreen from './';
import Definition from './../../../demo/utils/definition';

let definition = new Definition('dialog-full-screen', DialogFullScreen, {
  description: `A full-width and full-height dialog overlaid on the top of any page.`,
  designerNotes: `
* Useful to perform an action in context without navigating the user to a separate page.
* Whilst a standard Dialog component’s width might constrain what you can do, the full screen dialog uses the full width and height available.
* A good example could be importing a large volume of data, and checking for errors, in the context of an underlying Table of data.

### Related Components
* __Simple task in context?__ [Try Dialog](/components/dialog).
* __Need to refer back to the underlying page?__ [Try Sidebar](/components/sidebar).

 `,
  propValues: {
    title: 'Example Title for a DialogFullScreen',
    children: 'This is an example of a dialog full screen.',
  }
});

definition.isAModal();

export default definition;
