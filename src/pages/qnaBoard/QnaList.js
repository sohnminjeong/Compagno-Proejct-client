import { getQuestions } from "../../api/Question";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userSave } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  FaAnglesLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAnglesRight,
} from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import styled from "styled-components";
import { Form } from "react-bootstrap";

const Div = styled.div`
  position: relative;
  top: 150px;
  #topbar {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-top: 5px;
    height: 90px;

    Button {
      height: 35px;
      background-color: gray;
      border: 1px solid gray;
    }
  }
  Table {
    width: 70%;
    margin: 0 auto;
  }
  .paging {
    width: 100%;
    padding-top: 30px;
    text-align: center;
    button {
      border-radius: 5px;
      margin: 5px;
      font-weight: bolder;
    }
  }
  #search {
    display: flex;
    height: 35px;

    select {
      border-radius: 7px;
      border: 1px solid gray;
    }
    input {
      margin-left: 7px;
      margin-right: 7px;
      border-radius: 7px;
      border: 1px solid gray;
    }
    button {
      width: 120px;
      background-color: gray;
      border-radius: 5px;
      border: 1px solid gray;
      color: white;
    }
  }
`;

const Table = styled.table`
  thead {
    text-align: center;
    font-weight: bolder;
    th {
      height: 70px;
      padding-top: 20px;
      border: 1px solid;
    }
  }
  tbody {
    text-align: center;
    td {
      height: 50px;
      padding-top: 10px;
      border: 1px solid;
      a {
        color: black;
        text-decoration: none;
      }
    }
  }
`;

const QnaList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // user 세팅
  const user = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      dispatch(userSave(JSON.parse(localStorage.getItem("user"))));
    }
  }, []);

  // 페이징 처리
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지
  const [totalPage, setTotalPage] = useState(0); // 전체 총 페이지
  const [prev, setPrev] = useState(false); // 앞으로 한칸 버튼
  const [next, setNext] = useState(false); // 뒤로 한칸 버튼
  const [pages, setPages] = useState([]); // 페이지들

  // 페이지 변경될 때마다 호출!
  const questionAPI = async () => {
    const response = await getQuestions(page);
    setQuestions(response.data);
    setTotalPage(response.data.totalPages); // response에서 totalPages 불러와서 set으로 담기
  };
  // 첫페이지, 마지막 페이지, 페이지 리스트 초기 셋팅
  let lastPage = 0;
  let firstPage = 0;
  let pageList = [];

  // 페이지가 변할 때마다 questionAPI() 실행
  useEffect(() => {
    questionAPI();
  }, [page]);

  // totalPage가 바뀔 때 마다 실행
  useEffect(() => {
    lastPage = Math.ceil(page / 5) * 5; // 나는 한 화면에 1~5, 6~10 등 5개로 나뉘어서 보이기 때문에 5로 설정
    firstPage = lastPage - 4;
    if (totalPage < lastPage) {
      lastPage = totalPage; // 전체 페이지가 마지막 페이지보다 작은 경우엔 전체 페이지 수가 마지막 페이지 수랑 같음
    }
    setPrev(firstPage > 1);
    setNext(lastPage < totalPage);
    for (let i = firstPage; i <= lastPage; i++) {
      pageList.push(i); // 처음 i는 firstPage, 범위는 lastPage로 반복문 돌려서 i값을 넣은 list 만들기
    }
    setPages(pageList); // 해당 list 배열을 setPages에 담기
  }, [totalPage]);

  // ===============================

  const [select, setSelect] = useState("title");
  const [keyword, setKeyword] = useState("");

  const search = async () => {
    const response = await getQuestions(page, select, keyword);
    console.log(response.data);
    setQuestions(response.data);
    setTotalPage(response.data?.totalPages);
  };

  // const [counts, setCounts] = useState(1); // 데이터 총 갯수

  // 입력한 비밀번호
  const [secretPwd, setSecret] = useState("");
  const [code, setCode] = useState("");

  // 모달창 구현
  const [modalShow, setModalShow] = useState(false);

  const CenterModal = (props) => {
    const [pwd, setPwd] = useState("");

    const pwdCheck = () => {
      console.log(secretPwd === pwd);
      console.log(code);
      if (secretPwd === pwd) {
        navigate("/compagno/question/detail/" + code);
      } else {
        alert("비밀번호가 일치하지 않습니다!");
        document.querySelector("#password").focus();
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            비밀글 확인 !
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>비밀글입니다. 비밀번호를 입력하세요.</p>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            닫기
          </Button>
          <Button variant="primary" onClick={pwdCheck}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Div>
      <CenterModal show={modalShow} onHide={() => setModalShow(false)} />
      <div id="topbar">
        <div>
          <p>전체 {questions?.totalElements}건</p>
        </div>
        <div id="search">
          <select onChange={(e) => setSelect(e.target.value)}>
            <option value={"title"}>제목</option>
            <option value={"content"}>내용</option>
            <option value={"id"}>작성자</option>
          </select>
          <Form.Control
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button onClick={search}>
            <IoSearch />
            조회
          </Button>
        </div>
        {Object.keys(user).length === 0 ? (
          <>
            <Button
              onClick={() => {
                navigate("/compagno/login");
              }}
            >
              질문 등록
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                navigate("/compagno/question/register");
              }}
            >
              질문 등록
            </Button>
          </>
        )}
      </div>
      <Table>
        <thead>
          <tr>
            <th>질문 번호</th>
            <th>답변 여부</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {questions?.content?.map((question) => {
            return (
              <tr key={question.qnaQCode}>
                <td>{question.qnaQCode}</td>
                <td>{question.qnaQStatus}</td>

                <td>
                  {question.secret === "" || question.secret == null ? (
                    // 비밀번호가 걸려있지 않을 때
                    <a href={`/compagno/question/detail/${question.qnaQCode}`}>
                      {question.qnaQTitle}
                    </a>
                  ) : (
                    <>
                      {user.userRole === "ROLE_ADMIN" ? (
                        <>
                          <a
                            href={`/compagno/question/detail/${question.qnaQCode}`}
                          >
                            {question.qnaQTitle}
                          </a>
                        </>
                      ) : (
                        <>
                          <a
                            href={`/compagno/question/detail/${question.qnaQCode}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setModalShow(true);
                              setSecret(question.secret);
                              setCode(question.qnaQCode);
                              console.log(question.secret);
                            }}
                          >
                            {question.secret === "" ||
                            question.secret == null ? (
                              // 비밀글이 아닐 때
                              <>{question.qnaQTitle}</>
                            ) : (
                              <>
                                <p>
                                  <FaLock />
                                  {question.qnaQTitle}
                                </p>
                              </>
                            )}
                          </a>
                        </>
                      )}
                    </>
                  )}
                </td>
                <td>{question.userId}</td>
                {/* qnaQDate가 null일 때 DateUpdate로 출력 */}
                {question.qnaQDate === "" || question.qnaQDate == null ? (
                  <>
                    <td>
                      {moment(question.qnaQDateUpdate).format("YY-MM-DD hh:mm")}
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {moment(question.qnaQDate).format("YY-MM-DD hh:mm")}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="paging">
        <FaAnglesLeft onClick={() => setPage(1)} />
        {/* 가장 첫 페이지로 */}
        <FaAngleLeft
          onClick={() => (page > 1 ? setPage(page - 1) : setPage(1))} // 현재 페이지에서 한칸 앞으로
        />
        {pages.map(
          (
            num,
            index // 배열 담은 pages를 map으로 만들어서 반복문 페이지번호 생성
          ) => (
            <button
              key={index}
              value={num}
              onClick={(e) => setPage(Number(e.target.value))}
            >
              {num}
            </button>
          )
        )}
        <FaAngleRight
          onClick={
            () => (page < totalPage ? setPage(page + 1) : setPage(totalPage)) // 현재 페이지에서 한칸 뒤로
          }
        />
        <FaAnglesRight onClick={() => setPage(totalPage)} />
        {/* 가장 마지막 페이지로 */}
      </div>
    </Div>
  );
};
export default QnaList;
