import { BrowserRouter , Route, Routes} from 'react-router-dom';
import Home from './Home/Home';
import CustomerComponent from './Customers/customer';
import Items from './Items/Items';
import InvoiceList from './InvoiceList/InvoiceList';

import InvoiceComponent from './Invoice/InvoiceComponent';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/invo" element={<CustomerComponent />} />
      <Route path="/item" element={<Items />} />
      <Route path="/list" element={<InvoiceList/>}/>
  
      <Route path="/invoices" element={<InvoiceComponent/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
