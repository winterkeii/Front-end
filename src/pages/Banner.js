import { Button, Col, Row } from "react-bootstrap"


export default function Banner(){
    return(
        <Row id="banner">
            <Col  className="p-5 d-flex flex-column align-items-center justify-content-center vh-100">
                
                <h1 id="banner-text" className="display-3 fw-bold mb-3 p-3">University of the Assumption</h1>
                <p id="banner-text" className="display-6 mb-5 p-3">Official Online Course Enrollment</p>
                <Button id="enroll" size="lg" className="rounded-pill py-3 px-5 shadow" href="/courses">Enroll Now!</Button>
            </Col>
        </Row>
    )
}