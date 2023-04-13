import { LightningElement, track } from 'lwc';

export default class GroupedComboBox extends LightningElement {
  @track value = '';

  options = [    { label: 'Apple', value: 'apple' },    { label: 'Banana', value: 'banana' },    { label: 'Grape', value: 'grape' }  ];

  optionGroups = [    {      label: 'Citrus',      options: [        { label: 'Lemon', value: 'lemon' },        { label: 'Orange', value: 'orange' },        { label: 'Grapefruit', value: 'grapefruit' }      ]
    },
    {
      label: 'Tropical',
      options: [
        { label: 'Pineapple', value: 'pineapple' },
        { label: 'Mango', value: 'mango' },
        { label: 'Papaya', value: 'papaya' }
      ]
    }
  ];

  handleChange(event) {
    this.value = event.target.value;
  }
}