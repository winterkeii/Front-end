import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CourseCard from "../components/CourseCard";
import UserContext from "../UserContext";

export default function Course() {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  // Fetch active courses
  const fetchCourses = () => {
    fetch("http://localhost:4000/courses/all/active", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((result) => result.json())
      .then((data) => {
        if (data.code === "ALL-ACTIVE-COURSES-RESULT") {
          setCourses(data.result);
        } else {
          setCourses([]); // Reset if no active courses
        }
      })
      .catch((error) => console.error("Error fetching active courses:", error));
  };

  // Fetch all courses (admin view)
  const fetchAllCourses = () => {
    fetch("http://localhost:4000/courses/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((result) => result.json())
      .then((data) => {
        if (data.code === "ALL-COURSES-RESULT") {
          setAllCourses(data.result);
        } else {
          setAllCourses([]); // Reset if no courses
        }
      })
      .catch((error) => console.error("Error fetching all courses:", error));
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCourses();
    if (user?.isAdmin) {
      fetchAllCourses();
    }
  }, [user]);

  return (
    <Container fluid className="p-5 d-flex flex-column justify-content-center align-items-center">
      <h1 className="mb-3 display-3 fw-bold">Welcome To The Course Page</h1>
      <p className="mb-5">Please select and enroll in your desired program and course.</p>

      <Container fluid className="bg-secondary p-3">
        <Row>
          {user && user.isAdmin
            ? allCourses.map((course) => (
                <Col lg={3} sm={12} className="d-flex flex-wrap" key={course._id}>
                  <CourseCard coursesData={course} />
                </Col>
              ))
            : courses.map((course) => (
                <Col lg={3} sm={12} className="d-flex flex-wrap" key={course._id}>
                  <CourseCard coursesData={course} />
                </Col>
              ))}
        </Row>
      </Container>
    </Container>
  );
}
