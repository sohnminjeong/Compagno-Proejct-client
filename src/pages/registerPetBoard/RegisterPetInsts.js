import { useState, useEffect } from "react";
import {
  getInsts,
  getProvinces,
  getDistricts,
} from "../../api/registerPetBoard";
import styled from "styled-components";

const Div = styled.div`
  width: 90%;
  margin: auto;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 100px;
  }
  .search-area {
    background: lightgrey;
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #444;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    /* 
    select,
    input {
      width: 90%;
      height: 40px;
      margin: auto;
      margin-bottom: 20px;
      padding: 0 5px;
      border-radius: 5px;
    }

    select {
      border: 1px solid grey;
    }

    button {
      width: 90%;
      height: 40px;
      margin: auto;
      background: black;
      color: white;
      border-radius: 5px;
      border: 1px solid black;
    }
  }

  @media screen and (min-width: 800px) {
    .search-area {
      flex-direction: row;

      select,
      input {
        width: 30%;
        margin-bottom: 0;
        margin-right: 10px;
      }

      button {
        width: 10%;
      }
    } */
  }

  /* table {
    width: 90%;
    margin: auto;
  }
  th {
    font-weight: bolder;
    text-align: center;
    height: 40px;
  }
  td {
    text-align: center;
    margin-bottom: 20px;
  }
  tbody tr :nth-child(3) {
    text-align: left;
  } */
  .list {
    padding: 20px;
    border-top: 1px solid gray;
  }
  .title {
    display: flex;
    line-height: 30px;
  }
  span {
    margin-right: 10px;
    font-weight: bolder;
    color: darkgrey;
  }
`;

const RegisterPetInsts = () => {
  const [insts, setInsts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [province, setProvince] = useState(0);
  const [district, setDistrict] = useState(0);
  // const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);

  const instsAPI = async () => {
    // setLoading(true);
    // const result = await getInsts(page);
    // const newData = result.data;
    // console.log(result.data);
    // setInsts((prev) => [...prev, ...newData]);
    // setPage((prev) => prev + 1);
    // setLoading(false);
    const result = await getInsts();
    setInsts(result.data);
  };

  const provinceAPI = async () => {
    const result = await getProvinces();
    setSelectedProvince(result.data);
  };

  const districtAPI = async (code) => {
    if (code !== "") {
      const result = await getDistricts(code);
      setSelectedDistrict(result.data);
    } else {
      setSelectedDistrict([]);
    }
  };

  useEffect(() => {
    // const scroll = () => {
    //   if (
    //     window.innerHeight + document.documentElement.scrollTop >=
    //       document.documentElement.offsetHeight &&
    //     !loading
    //   ) {
    //     instsAPI();
    //     provinceAPI();
    //   }
    // };
    // window.addEventListener("scroll", scroll);
    // return () => {
    //   window.removeEventListener("scroll", scroll);
    // };
    // }, [page, loading]);
    instsAPI();
    provinceAPI();
  }, []);

  const handleProvinceChange = (e) => {
    districtAPI(e.target.value);
    setProvince(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  return (
    <Div>
      <h1>동물등록 대행기관</h1>
      <div className="search-area">
        <div className="location-search">
          <p>지역선택 </p>
          <div className="selectBox">
            <div className="provinceSelect">
              <select id="province" onChange={handleProvinceChange}>
                <option value="">시/도 선택</option>
                {selectedProvince.map((province) => (
                  <option
                    key={province.locationCode}
                    value={province.locationCode}
                  >
                    {province.locationName}
                  </option>
                ))}
              </select>
            </div>
            {selectedProvince && (
              <div className="districtSelect">
                <select id="district" onChange={handleDistrictChange}>
                  <option value="">시/군/구 선택</option>
                  {selectedDistrict.map((district) => (
                    <option
                      key={district.locationCode}
                      value={district.locationCode}
                    >
                      {district.locationName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="input-search">
          <input id="seach-input" placeholder="검색어 입력" />
          <button>조회</button>
        </div>
      </div>

      {/* <table>
        <thead>
          <tr>
            <th>no</th>
            <th>기관명</th>
            <th>기관주소</th>
            <th>대표자명</th>
            <th>전화번호</th>
          </tr>
        </thead>
        <tbody>
          {insts.map((inst) => (
            <tr key={inst.regiBoardCode}>
              <td>{inst.regiBoardCode}</td>
              <td>{inst.regiInstName}</td>
              <td>{inst.regiInstAddr}</td>
              <td>{inst.regiInstOwner}</td>
              <td>{inst.regiInstPhone}</td>
            </tr>
          ))}
        </tbody>
      </table> */}

      {insts.map((inst) => (
        <div key={inst.regiBoardCode} className="list">
          <div className="title name">
            <span>기관명</span>
            <p>{inst.regiInstName}</p>
          </div>
          <div className="title owner">
            <span>대표자명</span>
            <p>{inst.regiInstOwner}</p>
          </div>
          <div className="title phone">
            <span>전화번호</span>
            <p>{inst.regiInstPhone}</p>
          </div>
          <div className="title addr">
            <span>주소</span>
            <p>{inst.regiInstAddr}</p>
          </div>
        </div>
      ))}
    </Div>
  );
};

export default RegisterPetInsts;
