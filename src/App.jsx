import { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import { Option } from "antd/es/mentions";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./features/Data/dataSlice";

//calculate total price for every product
const calculateTotal = (quantity, productSalePrice, Vat) => {
  console.log(quantity, productSalePrice, Vat);
  const total =
    quantity * productSalePrice + (quantity * productSalePrice * Vat) / 100;
  const Total = total.toFixed(2);
  return parseFloat(Total);
};

function App() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // fetch data form server
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // all added products state
  const [Products, setProducts] = useState([]);
  //get data from redux store
  const { data, isLoading } = useSelector((state) => state.data);

  const [totalProductsPrice, setTotalProductsPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [vatTax, setVatTax] = useState(0);
  const [payable, setPayable] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [DuaAmount, setDuaAmount] = useState(0);

  useEffect(() => {
    const totalPrice = Products.reduce((sum, product) => {
      return sum + product.total;
    }, 0);
    const TotalPrice = totalPrice.toFixed(2);
    setTotalProductsPrice(parseFloat(TotalPrice));

    setAfterDiscount(totalProductsPrice - discount);
    const amountToAdd = (vatTax / 100) * afterDiscount;
    const newBalance = afterDiscount + amountToAdd;
    setPayable(newBalance);
    setDuaAmount(payable - paidAmount);
  }, [
    Products,
    discount,
    setAfterDiscount,
    totalProductsPrice,
    afterDiscount,
    vatTax,
    payable,
    paidAmount,
  ]);

  const handleProductSelect = (value, key) => {
    const product = data?.getAllProduct?.find((item) => item.name === value);
    if (product) {
      const productName = product.name;
      const unit = product.unitMeasurement || 0;
      const Vat = product.productVat || 0.0;
      const productSalePrice = product.productSalePrice || 0.0;
      const quantity = product.productQuantity || 0;
      const vat = Vat + "%";
      const total = calculateTotal(quantity, productSalePrice, Vat);

      const newProduct = {
        productName,
        unit,
        quantity,
        productSalePrice,
        vat,
        total,
      };

      if (Products.length === 0) {
        form.setFieldsValue({
          products: [newProduct],
        });
        setProducts([newProduct]);
        const fields = form.getFieldsValue(["products"]);
        setProducts(fields.products);
      }

      if (Products.length > 0) {
        if (key >= 0 && key < Products.length) {
          Products[key] = newProduct;
          form.setFieldsValue({
            products: Products,
          });
          console.log("no render");
          setProducts(Products);
        } else {
          Products.push(newProduct);
          form.setFieldsValue({
            products: Products,
          });
          const fields = form.getFieldsValue(["products"]);
          setProducts(fields.products);
        }
      }
    }
  };
  // update sale price
  const handleSalePrice = (e, key) => {
    const updateProduct = Products.map((product, index) => {
      const productSalePrice = e;
      if (key === index) {
        const newProduct = {
          ...product,
          productSalePrice,
          total: calculateTotal(product.quantity, e, parseFloat(product.vat)),
        };
        return newProduct;
      } else {
        return product;
      }
    });
    setProducts(updateProduct);
    form.setFieldsValue({
      products: updateProduct,
    });
  };

  // update product quantity
  const handleQuantity = (e, key) => {
    const updateProduct = Products.map((product, index) => {
      const quantity = e;
      if (key === index) {
        const newProduct = {
          ...product,
          quantity,
          total: calculateTotal(
            e,
            product.productSalePrice,
            parseFloat(product.vat)
          ),
        };
        return newProduct;
      } else {
        return product;
      }
    });
    setProducts(updateProduct);
    form.setFieldsValue({
      products: updateProduct,
    });
  };

  // update vat tax
  const handleChangeVatTax = (e) => {
    const filteredTax = data.getAllVats.filter((taxItem) =>
      e.includes(taxItem.title)
    );
    const totalTax = filteredTax.reduce(
      (sum, taxItem) => sum + taxItem.percentage,
      0
    );
    setVatTax(totalTax);
  };
  const handlePaidAmount = (e) => {
    setPaidAmount(e);
  };
  // remove product
  const handleRemoveProduct = (index) => {
    const newProducts = Products.splice(index, 1);
    setProducts(newProducts);
  };


  const onFinish = (value) => {
    // submit form
  };

  let content;
  if (isLoading) {
    content = "loading...";
  }
  if (data) {
    content = (
      <div className="m-10">
        <Form
          form={form}
          name="control-ref"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                <div className="mb-3">
                  <div className="flex mb-1">
                    <span className="w-[30px]">SL</span>
                    <span className="w-[400px]">Product</span>
                    <span className="w-[90px]">U.M.</span>
                    <span className="w-[210px]">Quantity</span>
                    <span className="w-[210px]">Sale Price</span>
                    <span className="w-[150px]">Vat</span>
                    <span className="w-[150px]">Total</span>
                    <span>Delete</span>
                  </div>
                  <hr />
                </div>

                {fields.map(({ key, name, ...restField }, index) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 1,
                    }}
                    align="baseline"
                  >
                    <span>{index + 1}</span>
                    <Form.Item
                      {...restField}
                      name={[key, "productName"]}
                      rules={[
                        {
                          required: true,
                          message: "Product is required",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select a product"
                        optionFilterProp="children"
                        style={{ width: 400 }}
                        onChange={(value) => handleProductSelect(value, index)}
                      >
                        {data?.getAllProduct?.map((item) => (
                          <Option key={item.id} value={item.name}></Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item {...restField} name={[name, "unit"]}>
                      <InputNumber
                        disabled
                        placeholder="U.M."
                        // onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "Quantity is required",
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: 200 }}
                        placeholder="Quantity"
                        onChange={(e) => handleQuantity(e, index)}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "productSalePrice"]}
                      rules={[
                        {
                          required: true,
                          message: "Price is required",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: 200 }}
                        onChange={(e) => handleSalePrice(e, index)}
                        placeholder="5000"
                      />
                    </Form.Item>

                    <Form.Item {...restField} name={[name, "vat"]}>
                      <Input bordered={false} defaultValue={0 + "%"} />
                    </Form.Item>

                    <Form.Item {...restField} name={[name, "total"]}>
                      <Input readOnly bordered={false} defaultValue={0} />
                    </Form.Item>

                    <DeleteOutlined
                      className="bg-red-600 text-white p-2 rounded-sm"
                      onClick={() => {
                        remove(name);
                        handleRemoveProduct(index);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Product
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          
          {/* form left side */}
          <div className="flex justify-between">
            <div className="w-[48%]">
              <div className="flex justify-between items-center">
                <Form.Item
                  label="customer"
                  name={[name, "customer"]}
                  rules={[
                    {
                      required: true,
                      message: "Customer is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a customer"
                    optionFilterProp="children"
                    style={{ width: 450 }}
                  >
                    {data?.getAllCustomer?.map((person) => (
                      <Option key={person.id} value={person.name}></Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  // type="primary"
                  icon={<PlusOutlined />}
                  className="ml-2 mb-[-5px]"
                  // onClick={() => enterLoading(1)}
                >
                  Customer
                </Button>
              </div>

              <div className="flex justify-between">
                <Form.Item
                  style={{ width: "49%" }}
                  label="Date"
                  rules={[
                    {
                      required: true,
                      message: "Date is required",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  style={{ width: "49%" }}
                  name={[name, "user"]}
                  label="Sales Person"
                  rules={[
                    {
                      required: true,
                      message: "Person is required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    // onChange={onChange}
                    // onSearch={onSearch}
                    // onChange={handleChange}
                  >
                    {data?.getAllUser?.map((u) => (
                      <Option key={u.id} value={u.userName}></Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <Form.Item label="Shipping Address">
                <Input placeholder="Shopping Address" />
              </Form.Item>
              <Form.Item label="Note">
                <Input placeholder="Write sale Note" />
              </Form.Item>
            </div>

            {/* form write side */}
            <div className="w-[48%]">
              <div className="flex justify-between mb-2">
                <strong>Total:</strong>
                <strong>{totalProductsPrice}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <Form.Item name={[name, "discount"]}>
                  <InputNumber
                    onChange={(e) => setDiscount(e)}
                    style={{ width: "250px" }}
                    min={0}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between mb-2">
                <span>After Discount</span>
                <span>{afterDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span>Vat/Tax</span>
                <Form.Item name={[name, "vats"]} className="my-0">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: "250px",
                    }}
                    placeholder="Please select"
                    onChange={handleChangeVatTax}
                  >
                    {data?.getAllVats?.map((v) => (
                      <Option key={v.id} value={v.title}></Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="flex justify-between my-3">
                <span>Total payable</span>
                <span>
                  
                    {payable}
                 
                </span>
              </div>

              <div className="flex justify-between">
                <span>Paid Amount</span>
                <Form.Item name={[name , "paidAmount"]}>
                  <InputNumber
                    onChange={(e) => handlePaidAmount(e)}
                    style={{ width: "250px" }}
                    min={0}
                  />
                </Form.Item>
              </div>
              <div className="flex justify-between mb-2">
                <strong>Due Amount</strong>
                <strong>{DuaAmount}</strong>
              </div>
              <Form.Item>
                <Button style={{ width: "100%" }} htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    );
  }
  return content;
}

export default App;
