import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "../user/UserDashboard.css";
import "./ManagerInvoice.css";
import ReactPaginate from "react-paginate";
import { DatePicker } from "reactstrap-date-picker";
import { FaFileInvoiceDollar } from "react-icons/fa";
import axios from "../../axiosConfig";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ManagerInvoice = () => {
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch invoices from API
  const fetchInvoices = async (page = 0) => {
    try {
      setLoading(true);
      const token = currentUser?.accessToken;

      const response = await axios.get(
        `/api/user/admin/all-invoices?page=${page}&sortBy=${sortBy}&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInvoices(response.data.data);
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      // Fallback to empty array if API fails
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [sortBy, statusFilter]);

  return (
    <section className="manager-section">
      <Container>
        <div className="mt-3 manager">
          <div className="manager-user">
            <div>
              <FaFileInvoiceDollar fontSize={24} />
            </div>
            <h4>Quản lý hóa đơn</h4>
          </div>
          <div className="search-user">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm hoá đơn"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line"></i>
            </div>
            <div className="filter-controls" style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="notpaid">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option value="date">Sắp xếp theo ngày</option>
                <option value="total">Sắp xếp theo tổng tiền</option>
              </select>
            </div>
          </div>
        </div>
        <Row>
          <div className="mt-5">
            <>
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Đơn hàng</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                    <th>Tổng cộng</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                        Không có hóa đơn nào
                      </td>
                    </tr>
                  ) : (
                    invoices
                      .filter((item) =>
                        item.invoiceId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.users?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.shipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, idx) => (
                        <Tr data={item} key={idx} idx={idx} currentUser={currentUser} />
                      ))
                  )}
                </tbody>
              </Table>
              <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={totalPages}
                pageRangeDisplayed={5}
                onPageChange={(selectedItem) => {
                  fetchInvoices(selectedItem.selected);
                }}
                forcePage={currentPage}
                containerClassName="pagination"
                activeClassName="active"
              />
            </>
          </div>
        </Row>
      </Container>
    </section>
  );
};

const Tr = ({ data, idx, currentUser }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  return (
    <>
      <tr>
        <td>{idx + 1}</td>
        <td>#{data?.invoiceId} - {data?.users?.username || 'N/A'} - {data?.shipAddress || 'N/A'}</td>
        <td>{data?.orderDate ? new Date(data.orderDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
        <td>
          <div>
            <div>
              <Button
                color={`${
                  data?.status === "notpaid" ? "warning" :
                  data?.status === "paid" ? "success" :
                  data?.status === "cancelled" ? "danger" : "info"
                }`}
                onClick={toggle}
              >
                {data?.status === "notpaid" ? "Chưa thanh toán" :
                 data?.status === "paid" ? "Đã thanh toán" :
                 data?.status === "cancelled" ? "Đã hủy" :
                 data?.status}
              </Button>
            </div>
          </div>
        </td>
        <td>
          {data?.totalPrice ? data.totalPrice.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) : "N/A"}
        </td>
      </tr>
      <ModalInvoice modal={modal} toggle={toggle} invoiceData={data} currentUser={currentUser} />
    </>
  );
};

const ModalInvoice = ({ modal, toggle, invoiceData, currentUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedStatus, setEditedStatus] = useState(invoiceData?.status || '');
  const [editedAddress, setEditedAddress] = useState(invoiceData?.shipAddress || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (invoiceData) {
      setEditedStatus(invoiceData.status || '');
      setEditedAddress(invoiceData.shipAddress || '');
    }
  }, [invoiceData]);

  const handleSaveChanges = async () => {
    if (!invoiceData?.invoiceId) return;

    setSaving(true);
    try {
      const updateData = {
        status: editedStatus,
        shipAddress: editedAddress
      };

      const response = await axios.put(
        `/api/user/invoices/${invoiceData.invoiceId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      if (response.data.status === "ok") {
        toast.success("Cập nhật đơn hàng thành công!");
        setEditMode(false);
        // Refresh data
        window.location.reload();
      } else {
        toast.error("Có lỗi khi cập nhật đơn hàng");
      }
    } catch (error) {
      console.error("Update invoice error:", error);
      toast.error("Có lỗi khi cập nhật đơn hàng");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedStatus(invoiceData?.status || '');
    setEditedAddress(invoiceData?.shipAddress || '');
    setEditMode(false);
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>
          {editMode ? (
            <span style={{ color: "#ffc107" }}>
              ✏️ Chỉnh sửa đơn hàng #{invoiceData?.invoiceId}
            </span>
          ) : (
            `Chi tiết đơn hàng #${invoiceData?.invoiceId}`
          )}
        </ModalHeader>
        <ModalBody>
          <div className="invoice-container">
            <div className="invoice-header">
              <h5>Đặt hàng #{invoiceData?.invoiceId} chi tiết</h5>
              <p>
                Thanh toán qua Trả tiền mặt khi nhận hàng.
                Địa chỉ giao hàng: {invoiceData?.shipAddress || 'N/A'}
              </p>
            </div>
            <div className="grid-container">
              <Row lg={12}>
                <Col>
                  <div className="date-grid">
                    <h6>Chung</h6>
                    <Form>
                      <FormGroup>
                        <Label>Ngày tạo</Label>
                        <Input
                          type="text"
                          disabled
                          value={invoiceData?.orderDate ? new Date(invoiceData.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Trạng thái</Label>
                        <Input
                          name="select"
                          type="select"
                          value={editMode ? editedStatus : (invoiceData?.status || '')}
                          onChange={(e) => editMode && setEditedStatus(e.target.value)}
                          disabled={!editMode}
                        >
                          <option value="notpaid">Chưa thanh toán</option>
                          <option value="paid">Đã thanh toán</option>
                          <option value="cancelled">Đã hủy</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label>Khách hàng</Label>
                        <Input
                          type="text"
                          disabled
                          value={`${invoiceData?.users?.username || 'N/A'} (${invoiceData?.users?.email || 'N/A'})`}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Địa chỉ giao hàng</Label>
                        <Input
                          type="textarea"
                          value={editMode ? editedAddress : (invoiceData?.shipAddress || '')}
                          onChange={(e) => editMode && setEditedAddress(e.target.value)}
                          disabled={!editMode}
                          rows="3"
                        />
                      </FormGroup>
                    </Form>
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <h6>Thanh toán</h6>
                    <div>
                      <p>Trạng thái: {
                        invoiceData?.status === "notpaid" ? "Chưa thanh toán" :
                        invoiceData?.status === "paid" ? "Đã thanh toán" :
                        invoiceData?.status === "cancelled" ? "Đã hủy" : "N/A"
                      }</p>
                      <p>Tổng tiền: {invoiceData?.totalPrice ? invoiceData.totalPrice.toLocaleString("it-IT", { style: "currency", currency: "VND" }) : "N/A"}</p>
                    </div>
                    <div>
                      <p>Thông tin khách hàng:</p>
                      <p>Tên: {invoiceData?.users?.username || 'N/A'}</p>
                      <p>Email: {invoiceData?.users?.email || 'N/A'}</p>
                      <p>Phone: {invoiceData?.users?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <h6>Giao nhận</h6>
                    <div>
                      <p>Địa chỉ giao hàng</p>
                      <p>{invoiceData?.shipAddress || 'N/A'}</p>
                      <p>Người nhận: {invoiceData?.users?.username || 'N/A'}</p>
                      <p>SĐT: {invoiceData?.users?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Chi phí</th>
                  <th>SL</th>
                  <th>Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.invoiceDetails && invoiceData.invoiceDetails.length > 0 ? (
                  invoiceData.invoiceDetails.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <img
                          src={item.product?.imgUrl || "https://via.placeholder.com/100"}
                          alt="img-product"
                          style={{
                            objectFit: "cover",
                            height: "100px",
                            width: "100px",
                          }}
                        />
                        <span style={{ marginLeft: "20px" }}>
                          {item.product?.productName || 'N/A'}
                        </span>
                      </th>
                      <td>
                        {item.price ? (item.price / item.quantity).toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        }) : 'N/A'}
                      </td>
                      <td>x{item.quantity || 0}</td>
                      <td>
                        {item.price ? item.price.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Form>
              <FormGroup>
                <Label>Thêm ghi chú</Label>
                <Input id="exampleText" name="text" type="textarea" />
              </FormGroup>
            </Form>
            <div>
              <h6 style={{ textAlign: "end", marginRight: "50px" }}>
                Tổng cộng:
                <span style={{ marginLeft: "20px" }}>
                  {invoiceData?.totalPrice ? invoiceData.totalPrice.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  }) : "N/A"}
                </span>
              </h6>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {!editMode ? (
            <>
              <Button color="warning" onClick={() => setEditMode(true)}>
                Chỉnh sửa
              </Button>
              <Button color="secondary" onClick={toggle}>
                Đóng
              </Button>
            </>
          ) : (
            <>
              <Button
                color="success"
                onClick={handleSaveChanges}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button color="secondary" onClick={handleCancelEdit}>
                Hủy
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ManagerInvoice;
