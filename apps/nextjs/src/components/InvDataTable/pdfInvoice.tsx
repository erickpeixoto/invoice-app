 
 
 
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { InvoiceFormData } from ".";

export interface PDFInvoiceProps {
  invoice: InvoiceFormData;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    flexGrow: 1,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    marginTop: "20px",
    marginBottom: "20px",
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    width: 200,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
  item: {
    fontWeight: "bold",
    fontSize: 15,
  },
  separator: {
    paddingBottom: 20,
    borderBottom: 1,
    borderColor: "#d3d4da",
  },
  container: {
    flexDirection: "column",
    alignItems: "flex-end",
    width: "100%",
  },
});

const PDFInvoice = ({ invoice }: PDFInvoiceProps) => {
  const { lineItems = [] } = invoice;
  const subtotal = invoice?.subtotal ?? 0;
  const tax = invoice?.tax ?? 0;
  const totalAmount = invoice?.totalAmount ?? 0;

  return (
    <Document>
      <Page style={styles.page}>
        {/* Add Logo if it exists */}
        {invoice.logo && (
          <Image src={invoice.logo} style={{ width: 180, marginBottom: 20 }} />
        )}

        {/* Invoice Header */}
        <Text style={styles.title}>INVOICE #{invoice.invoiceNumber}</Text>

        {/* Billing Details */}
        <View style={styles.flex}>
          <View style={{ ...styles.section, width: "60%" }}>
            <Text style={{ ...styles.label, marginBottom: 10 }}>BILL TO:</Text>
            <Text style={styles.info}>{invoice.clientId}</Text>
            {/* You can add more client details here, like client's address, contact, etc. */}
          </View>

          <View style={{ ...styles.section, width: "40%" }}>
            <Text style={{ ...styles.label, marginBottom: 5 }}>
              Invoice Date:
            </Text>
            <Text style={{ ...styles.info, marginBottom: 10 }}>
              {new Date(invoice.issuedDate).toDateString()}
            </Text>
            <Text style={{ ...styles.label, marginBottom: 5 }}>Due Date:</Text>
            <Text style={{ ...styles.info, marginBottom: 10 }}>
              {new Date(invoice.dueDate).toDateString()}
            </Text>
            <Text style={{ ...styles.label, marginBottom: 5 }}>Status:</Text>
            <Text style={styles.info}>{invoice.status}</Text>
            {/* Here you can also add other details, like payment methods, purchase order number, etc. */}
          </View>
        </View>

        {/* User details (assuming this is the salesperson or the person handling the invoice) */}
        <Text style={{ ...styles.label, marginTop: 20, marginBottom: 10 }}>
          Handled by:
        </Text>
        <Text style={styles.info}>
          {invoice.userId} {invoice.userId}
        </Text>

        {/* Invoice Summary */}
        <Text style={{ ...styles.title, marginTop: 30 }}>Invoice Summary</Text>
        {lineItems.map((item) => (
          <View style={styles.flex} key={item.amount}>
            <Text style={styles.label}>{item.description}</Text>
            <Text style={styles.info}>
              {invoice.currency} {item.amount.toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={{ ...styles.container, marginTop: 30 }}>
          <View style={{ ...styles.flex, ...styles.total }}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text style={styles.info}>
              {invoice.currency} {subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={{ ...styles.flex, ...styles.total }}>
            <Text style={styles.label}>Tax:</Text>
            <Text style={styles.info}>
              {invoice.currency} {tax.toFixed(2)}
            </Text>
          </View>
          <View style={{ ...styles.flex, ...styles.total, marginTop: 10 }}>
            <Text style={{ ...styles.label, fontWeight: "bold" }}>
              Total Amount:
            </Text>
            <Text style={{ ...styles.info, fontWeight: "bold" }}>
              {invoice.currency} {totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        {/* You can also add a footer here with company details, terms & conditions, etc. */}
      </Page>
    </Document>
  );
};

export default PDFInvoice;
