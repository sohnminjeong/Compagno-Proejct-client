import { useState } from "react";
import { addQuestion } from "../../api/Question";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [secret, setSecret] = useState("");
  const [images, setImages] = useState([]);

  // const info = useSelector((state) => {
  //   return state.user;
  // });

  const imageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const cancel = () => {
    navigate("/compagno/question");
  };

  const add = async () => {
    const formData = new FormData();
    formData.append("qnaQTitle", title);
    formData.append("qnaQContent", content);
    images.forEach((image, index) => {
      formData.append(`files[${index}]`, image);
    });
    formData.append("secret", secret);

    console.log(formData.get("qnaQTitle"));
    console.log(images);

    await addQuestion(formData);
    navigate("/compagno/question");
  };

  return (
    <>
      <h1>Question?</h1>

      <div>
        <Form.Control
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="비밀글 비밀번호"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <Form.Control
          type="textarea"
          placeholder="내용"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={imageChange}
        />
        <Button variant="warning" onClick={add}>
          등록
        </Button>
        <Button onClick={cancel}>취소</Button>
      </div>
    </>
  );
};

export default Register;
