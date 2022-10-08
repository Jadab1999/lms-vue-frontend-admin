import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Ripple from 'primevue/ripple';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Tooltip from 'primevue/tooltip';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import Calendar from 'primevue/calendar';
import Menu from 'primevue/menu';
import Badge from 'primevue/badge';
import MultiSelect from 'primevue/multiselect';
import Chart from 'primevue/chart';
import SplitButton from 'primevue/splitbutton';
import Editor from 'primevue/editor';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import FileUpload from 'primevue/fileupload';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import InputSwitch from 'primevue/inputswitch';
import RadioButton from 'primevue/radiobutton';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ColorPicker from 'primevue/colorpicker';
import InputMask from 'primevue/inputmask';
import Knob from 'primevue/knob';
import Password from 'primevue/password';

import "./assets/style/Global.scss";
 
const app = createApp(App);

app.use(PrimeVue, { ripple: true });
app.use(store);
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Dropdown', Dropdown);
app.component('Toolbar', Toolbar);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('Calendar', Calendar);
app.component('Menu', Menu);
app.component('Badge', Badge);
app.component('MultiSelect', MultiSelect);
app.component('Chart', Chart);
app.component('SplitButton', SplitButton);
app.component('Editor', Editor);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('FileUpload', FileUpload);
app.component('Textarea', Textarea);
app.component('Checkbox', Checkbox);
app.component('Chips', Chips);
app.component('InputSwitch', InputSwitch);
app.component('RadioButton', RadioButton);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ColorPicker', ColorPicker);
app.component('InputMask', InputMask);
app.component('Knob', Knob);
app.component('Password', Password);
app.mount('#app')
