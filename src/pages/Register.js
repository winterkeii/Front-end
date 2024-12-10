import { useState, useContext } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";






export default function Register(){

    const {user} = useContext(UserContext);

    let [firstName, setFirstName] = useState("");
    let [middleName, setMiddleName] = useState("");
    let [lastName, setLastName] = useState("");
    let [email, setEmail] = useState("");
    let [contactNumber, setContactNumber] = useState("");
    let [password, setPassword] = useState("");

    console.log(firstName);

    function register(e){
        e.preventDefault();

        fetch("http://localhost:4000/users/register", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                email: email,
                contactNumber: contactNumber,
                password: password
            })
        })
        .then(result => result.json())
        .then(result => {
            if(result.code === "REGISTRATION-SUCCESS"){
                Swal.fire({
                    title: "SUCCESS!",
                    text: result.message,
                    icon: "success"
                })
                setFirstName("");
                setMiddleName("");
                setLastName("");
                setEmail("");
                setContactNumber("");
                setPassword("");
            }else{
                Swal.fire({
                    title: "EMAIL IS ALREADY IN USE",
                    text: "Please try again with another email",
                    icon: "error"
                })
            }
        })
    }

    return(
            user.id !== null ?
            <Navigate to="/"/>
            :
            <Container fluid className="vh-100">
            <Row className="h-100 g-0">
              {/* Left Column */}
              <Col
                xs={12}
                md={6}
                className="bg-warning d-flex flex-column align-items-center justify-content-center text-center py-5"
              >
                <h1 className="display-6 fw-bold">REGISTER NOW!</h1>
                <p className="lead">Your Bright Future Begins Here!</p>
              </Col>
          
              {/* Right Column */}
              <Col
                xs={12}
                md={6}
                className="d-flex flex-column align-items-center justify-content-center py-5"
              >
                <Container
                  className="p-4 shadow rounded-3 border-bottom border-3 border-warning w-100"
                  style={{ maxWidth: "400px" }}
                >
                  <h1 className="display-6 fw-bold mb-4 text-center">REGISTER</h1>
          
                  <Form onSubmit={(e) => register(e)}>
                    <Form.Group className="mb-3" controlId="firstName">
                      <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        required
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                      />
                    </Form.Group>
          
                    <Form.Group className="mb-3" controlId="middleName">
                      <Form.Control
                        type="text"
                        placeholder="Enter your middle name"
                        required
                        onChange={(e) => setMiddleName(e.target.value)}
                        value={middleName}
                      />
                    </Form.Group>
          
                    <Form.Group className="mb-3" controlId="lastName">
                      <Form.Control
                        type="text"
                        placeholder="Enter your last name"
                        required
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                      />
                    </Form.Group>
          
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </Form.Group>
          
                    <Form.Group className="mb-3" controlId="contactNumber">
                      <Form.Control
                        type="number"
                        placeholder="Enter your mobile number"
                        required
                        onChange={(e) => setContactNumber(e.target.value)}
                        value={contactNumber}
                      />
                    </Form.Group>
          
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </Form.Group>
          
                    <Form.Group className="mb-3">
                      <Button
                        variant="warning"
                        className="w-100 rounded-pill"
                        type="submit"
                      >
                        Register
                      </Button>
                    </Form.Group>
                  </Form>
                </Container>
              </Col>
            </Row>
          </Container>
          
    );
}