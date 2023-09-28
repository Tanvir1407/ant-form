
import  { useEffect, useState } from "react";
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


function App() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  
  
  const { data ,isLoading, isError, error} = useSelector(state => state.data)
  

    const handleProductSelect = (value, key) => {

      const product = data?.getAllProduct?.find((item) => item.name === value);
      if (product) {
        const unit = product.unitMeasurement; 
        const vat = product.productVat; 
        const productSalePrice = product.productSalePrice; 
        console.log(vat)
        form.setFieldsValue({
          [`users[${key}].unit`]: unit,
          [`users[${key}].Vat`]: vat,
          [`users[${key}].productSalePrice`]: productSalePrice,
        });
      }
    };
  
  const onFinish =(value)=>{
    console.log(value)
  }
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
        >
          <Form.List name="users">
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

                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 1,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[key, "product"]}
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
                        onChange={handleProductSelect}
                      >
                        {data?.getAllProduct?.map((item) => (
                          <Option key={item.id} value={item.name}></Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item {...restField} name={[key, "unit"]}>
                      <InputNumber
                        readOnly
                        placeholder="U.M."
                        // onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[key, "quantity"]}
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
                        defaultValue="1"
                        // onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[key, "productSalePrice"]}
                      rules={[
                        {
                          required: true,
                          message: "Price is required",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: 200 }}
                        placeholder="5000"
                        // onChange={onChange}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[key, "Vat"]}
                      defaultValue="0.00"
                    >
                      <Input bordered={false} />
                    </Form.Item>

                    <Form.Item
                      defaultValue={0}
                      {...restField}
                      name={[key, "Total"]}
                    >
                      <Input bordered={false} />
                    </Form.Item>

                    <DeleteOutlined
                      className="bg-red-600 text-white p-2 rounded-sm"
                      onClick={() => {
                        remove(name);
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
          <div className="flex justify-between">
            {/* form left side */}

            <div className="w-[48%]">
              <div className="flex justify-between">
                <Form.Item
                  name={[name, "customerId"]}
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
                  className="ml-2"
                  // onClick={() => enterLoading(1)}
                >
                  Customer
                </Button>
              </div>

              <div className="flex justify-between">
                <Form.Item style={{ width: "49%" }}>
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  style={{ width: "49%" }}
                  name={[name, "userId"]}
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
              <Form.Item>
                <Input placeholder="Shopping Address" />
              </Form.Item>
              <Form.Item>
                <Input placeholder="Write sale Note" />
              </Form.Item>
            </div>

            {/* form write side */}
            <div className="w-[48%]">
              <div className="flex justify-between mb-1">
                <strong>Total:</strong>
                <strong>0.00</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <Form.Item>
                  <InputNumber style={{ width: "250px" }} min={0} />
                </Form.Item>
              </div>
              <div className="flex justify-between mb-1">
                <span>After Discount</span>
                <span>0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Vat/Tax</span>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "250px",
                  }}
                  placeholder="Please select"
                  // onChange={handleChange}
                >
                  {data?.getAllVats?.map((v) => (
                    <Option key={v.id} value={v.title}></Option>
                  ))}
                </Select>
              </div>
              <div className="flex justify-between my-2">
                <span>Total payable</span>
                <span>0.00</span>
              </div>

              <div className="flex justify-between">
                <span>Paid Amount</span>
                <Form.Item>
                  <InputNumber style={{ width: "250px" }} min={0} />
                </Form.Item>
              </div>
              <div className="flex justify-between ">
                <strong>Due Amount</strong>
                <strong>0.00</strong>
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
