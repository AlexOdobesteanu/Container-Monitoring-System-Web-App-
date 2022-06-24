import React, { useContext, useEffect, useState, useRef } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { UserContext } from '../App'
import Home from '../logos/home-solid.svg';
import DockerLogo from '../logos/docker-logo.svg'
import logo from '../logos/mylogo.png'
import History from '../logos/history.png'
import AlertHistoryLogo from '../logos/alertHistory.png';
import styled from "styled-components";
import '../nav.css'
import { Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import alertdetails from '../logos/alertdetails.png'

const Container = styled.div`
  position: fixed;
  .active{
      border-right:2px solid white;
  }
`;

const Button2 = styled.button`
  background-color: rgb(40, 44, 52);
  border: 3px solid rgb(62, 68, 82);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &::before,
  &::after {
    content: "";
    background-color: var(--white);
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }
  &::before {
    top: ${(props) => (props.clicked ? "1.5" : "1rem")};
    transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }
  &::after {
    top: ${(props) => (props.clicked ? "1.2" : "1.5rem")};
    transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

const SidebarContainer = styled.div`
  background-color: rgb(40, 44, 52);
  width: 3.5rem;
  height: 80vh;
  border: 3px solid rgb(62, 68, 82);
  margin-top: 1rem;
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Logo = styled.div`
  width: 2rem;
  img {
    width: 100%;
    height: auto;
  }
`;

const SlickBar = styled.ul`
  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(40, 44, 52);
  border: 3px solid rgb(62, 68, 82);
  padding: 2rem 0;
  position: absolute;
  top: 6rem;
  left: 0;
  width: ${(props) => (props.clicked ? "12rem" : "3.5rem")};
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;
`;

const Item = styled(NavLink)`
  text-decoration: none;
  color: white;
  width: 100%;
  padding: 1.5rem 0;
  cursor: pointer;
  display: flex;
  padding-left: 0.5rem;
  &:hover {
    border-right: 2px solid white;
    img {
        color:white;
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
        brightness(103%) contrast(103%);
    }
  }
  img {
    width: 2rem;
    height: 2rem;
    filter: invert(92%) sepia(4%) saturate(1033%) hue-rotate(169deg)
      brightness(100%) contrast(85%);
  }
`;

const Text = styled.span`
  width: ${(props) => (props.clicked ? "100%" : "0")};
  overflow: hidden;
  margin-left: ${(props) => (props.clicked ? "1rem" : "0")};
  transition: all 0.2s ease;
`;

const Sidebar = () => {

  const [click, setClick] = useState(false)
  const HandleClick = () => setClick(!click);
  const { state, dispatch } = useContext(UserContext)

  const renderList = () => {
    if (state) {
      return [
        <>
          <Button2 clicked={click} onClick={() => HandleClick()}></Button2>
          <Container>
            <SidebarContainer>

              <Logo>
                <img src={logo} alt="logo"></img>
              </Logo>
              <SlickBar clicked={click}>


                <Item onClick={() => setClick(false)} exact activeClassName="active" to="/">
                  <img src={Home} alt="logo"></img>
                  <Text clicked={click}>Home</Text>
                </Item>

                <Item onClick={() => setClick(false)} activeClassName="active" to="/dockersupport">
                  <img src={DockerLogo} alt="logo" style={{ fill: 'white', stroke: 'white' }}></img>
                  <Text clicked={click}>Configure Docker</Text>
                </Item>
                <Item onClick={() => setClick(false)} activeClassName="active" to="/allclusters">
                  <img src={History} alt="logo"></img>
                  <Text clicked={click}>View Docker Instances</Text>
                </Item >

                <Item onClick={() => setClick(false)} activeClassName="active" to="/alerts">
                  <img src={alertdetails} alt="logo"></img>
                  <Text clicked={click}>View Alert Details</Text>
                </Item >

                <Item onClick={() => setClick(false)} activeClassName="active" to="/alertHistory">
                  <img src={AlertHistoryLogo} alt="logo"></img>
                  <Text clicked={click}>View Alert History</Text>
                </Item >
                {/* <Item onClick={() => setClick(false)}>
                                    <img src={logo} alt="logo"></img>
                                    <Text clicked={click}>Alternative</Text>
                                </Item> */}

              </SlickBar>
            </SidebarContainer>
          </Container>
        </>
      ]

    }
    else {
      return <></>
    }
  }


  return (
    <>{renderList()}</>

  )
}

export default Sidebar