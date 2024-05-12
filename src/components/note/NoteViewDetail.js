import { viewOneNote } from "../../api/note";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSave } from "../../store/user";
import { MdOutlineFileDownload } from "react-icons/md";
import styled from "styled-components";

const Div = styled.div`
  a {
    text-decoration: none;
    color: black;
    &:hover {
      color: green;
    }
  }
`;
const NoteViewDetail = (props) => {
  // 유저정보 가지고온다
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.user;
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      dispatch(userSave(JSON.parse(localStorage.getItem("user"))));
    }
  }, []);

  //   const { code } = useParams();
  const [note, setNote] = useState({});
  const noteAPI = async () => {
    const response = await viewOneNote(props.name);
    console.log(response.data);
    setNote(response.data);
  };
  useEffect(() => {
    noteAPI();
  }, []);

  return (
    <>
      {note.noteCode}
      {note.noteTitle}
      {note.noteContent}
      {note.sender}
      {note.receiver}
      {note.noteRegiDate}
      {note.files?.map((file) => (
        <Div key={file.noteFileCode}>
          <a
            href={file.noteFileUrl?.replace(
              "\\\\DESKTOP-U0CNG13\\upload\\note",
              "http://192.168.10.28:8081/note/"
            )}
            download
          >
            <MdOutlineFileDownload style={{ fontSize: "1.5rem;" }} />
            첨부 파일 다운로드
          </a>
        </Div>
      ))}
    </>
  );
};
export default NoteViewDetail;
