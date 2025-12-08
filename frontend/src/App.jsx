import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
    const currentDateTime = new Date().toISOString().slice(0, 16); //format time dd/mm/yyyyThh:mm
    const formDataObj = {
        title: "",
        description: "",
        status: 0,
        due: "",
    };
    const [formData, setFormData] = useState(formDataObj);
    const [validated, setValidated] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState(false);
    const [resp, setResp] = useState(null);

    function handleChange(e) {
        let value = e.target.value;
        if (e.target.type == "checkbox") {
            value = e.target.checked ? 1 : 0;
        }
        console.log(e.target.name);
        console.log(value);

        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: value,
        }));
    }

    async function submitClicked(e) {
        e.preventDefault();
        setValidated(true);
        const form = e.currentTarget.closest("form");
        if (form.checkValidity() === false) {
            console.log("form invalid");
            e.stopPropagation();
            return;
        }
        //when form is valid proceed to upload data
        try {
            const response = await axios.post(
                "http://localhost:8080/tasks",
                formData,
                { headers: { "content-type": "application/json" } }
            );
            setResp(response.data.data);
            setShowAddModal(true);
            setFormData(formDataObj);
            setValidated(false);
        } catch (err) {
            setError(err);
        }
    }

    function handleCloseModal() {
        setShowAddModal(false);
    }

    return (
        <>
            <Container className="form-add-task col-sm-8">
                <h2 className="text-center">Create a task</h2>
                <Form noValidate validated={validated}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="txt-title">Title</Form.Label>
                        <Form.Control
                            type="text"
                            id="txt-title"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            required
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a title for the task
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="txt-description">
                            Description
                        </Form.Label>
                        <Form.Control
                            noValidate
                            as="textarea"
                            rows={3}
                            id="txt-description"
                            name="description"
                            placeholder="(optional)"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            noValidate
                            type="checkbox"
                            id="chk-status"
                            name="status"
                            label="Status"
                            checked={formData.status === 1}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="dt-due">Due Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            id="dt-due"
                            name="due"
                            required
                            style={{ width: "200px" }}
                            min={new Date().toISOString().slice(0, 16)} // Future dates only
                            value={formData.due}
                            onChange={handleChange}
                            isInvalid={
                                validated &&
                                new Date(formData.due) <= new Date()
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {!formData.due
                                ? "Please enter a due date"
                                : "Due date must be in the future"}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={submitClicked}
                            /*
                            disabled=formData.title.length == 0 || formData.due == ""
                                ? true
                                : false
                        */
                        >
                            Create task
                        </Button>
                    </Form.Group>
                </Form>
            </Container>
            <Modal show={showAddModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>✅ Task Created Successfully!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {resp && (
                        <div className="mt-3 p-3 bg-light rounded">
                            <h6>Task Details:</h6>
                            Title: {resp.title}
                            <br />
                            Description:{" "}
                            {resp.description.length > 0
                                ? resp.description
                                : "No description given"}
                            <br />
                            Status: {resp.status == 0 ? "Not done" : "Done"}
                            <br />
                            Due date/time: {resp.due.replace("T", " ")}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default App;
