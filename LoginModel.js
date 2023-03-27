import React from 'react';
import { withRouter } from 'react-router'
import TermsConditions from '../TermsConditions/TermsConditions'
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import * as actionTypes from '../../../store/constants'
import CryptoJS from 'crypto-js'
import {
  postData,
  getData,
  postDatalogin,
  removeLocalStorage,
  setLocalStorage,
  getLocalStorage, allowparticualrchar
} from '../../../Util';
import * as apilist from '../../../apiList';
import { connect } from 'react-redux';
import './LoginModal.scss'

let userinfodate = {};

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {
        userid: '',
        password: '',
        captcha: '',
        rememberMe: false,
        loginDisable: true,
        errorMsg: '',
        capchaid: '',
        passshows:"password",
        clspassshow:true
      },
      forgotPassword: {
        isVisible: false,
        forgotUserId: '',
        forgotDisable: true,
        otp: '',
        mob: '',
        uuid: '',
        loginid: '',
        updtpass: '',
        confpass: '',
        otpBlock: false
      },
      others: {},
      resetPasswd: {
        errorInfo: '',
        newPasswd: ''
      },
      loadcaptch: this.capchafn,
      tnc: false, disclaimer: 1, tncCheckBox: false, tempPass: false
    }

    this.handleuserVals = this.handleuserVals.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.updateUserID = this.updateUserID.bind(this);
    this.sentToNext = this.sentToNext.bind(this);
    // if (!(this.props.uD && this.props.uD.loginid)) {
    //   this.state.loadcaptch();
    // }
  }

  closeVal = () => {
    let newObj = this.state.forgotPassword;
    newObj.isVisible = false;
    this.setState({
      forgotPassword: newObj
    });
  }

  componentDidMount() {
    this.capchafn();
    this.checkRememberMe();
     }

  checkRememberMe = () => {
    let userObj = getLocalStorage("rememberUser"),
      userInfo = this.state.userInfo;
    if (userObj) {
      userObj = JSON.parse(userObj);
      userInfo.userid = userObj.userid;
      userInfo.password = window.atob(userObj.password);
      userInfo.rememberMe = userObj.rememberMe;
    }
    this.setState({
      userInfo: userInfo
    })
  }

  updateForgotInfo = (event) => {
    var name = event.target.name,
      value = event.target.value;

    this.setState(prevState => {
      let forgotPassword = Object.assign({}, prevState.forgotPassword);
      forgotPassword[name] = value;
      forgotPassword[name] !== '' ? forgotPassword.forgotDisable = false : forgotPassword.forgotDisable = true;
      return { forgotPassword };
    });
  }

  updateState = (name, value) => {
    let userInfo = this.state.userInfo;
    userInfo[name] = value;
    userInfo.loginDisable = true;
    if (name !== "rememberMe") {
      userInfo.rememberMe = false;
    }


    removeLocalStorage("rememberUser");

    if (userInfo.userid !== '' && userInfo.password !== '' && userInfo.captcha !== '') {

      userInfo.loginDisable = false;
    }
    this.setState({
      userInfo: userInfo
    });
  };

  handleuserVals = (event) => {
    let uInfo = this.state.userInfo;
    uInfo.errorMsg = '';
    if(event.target.value!==''){
    if(!allowparticualrchar.test(event.target.value)){
      return false;
  }}
    this.updateState(event.target.name, event.target.value);
  }

  handleuserChecked = (event) => {
    const checked = event.target.checked
    this.setState(prevState => ({ userInfo: { ...prevState.userInfo, rememberMe: checked } }));
  }

  forgotPassword = () => {

    let st = this.state.forgotPassword;
    //console.log(st)
    st['isVisible'] = true;
    //console.log(this.state.forgotPassword, st)
    this.setState({ forgotPassword: st })
  }

  validateUserID = () => {
    let forgotInfo = this.state.forgotPassword;
    let newObj = {};
    newObj.userId = forgotInfo.forgotUserId;
    newObj.platform = 'w';
    const datas = postData(apilist.forgotpass, newObj);
    datas.then((dataVals) => {
      //console.log(dataVals);
      if (dataVals.statuscode === 200) {
        if (dataVals.data.id !== '' && dataVals.data.loginid !== '' && dataVals.data.mob !== '') {
          let newObj = this.state.forgotPassword;
          newObj.uuid = dataVals.data.id;
          newObj.loginid = dataVals.data.loginid;
          newObj.mob = dataVals.data.mob;
          newObj.otpBlock = true;
          this.setState({
            forgotPassword: newObj
          });
        } else {
          //console.log('uuid not received');
          return false;
        }
      } else {
        alert(dataVals.message);
      }
    });
  }


  sentToNext = (val) => {
    let uIData = userinfodate.data, chktemppas = false, tncVal = true;

    if (val) {
      chktemppas = uIData.temppass;
    } else {
      userinfodate = '';
      this.props.ctrs();
      tncVal = false;
    }
    this.setState({
      disclaimer: !this.state.disclaimer,
      tempPass: chktemppas,
      tnc: tncVal
    });
  }

  //Encyption function for AL//
  aesAlKeyGen = (val1) => {

    var dividedString = this.devideValue(val1);
    val1 = dividedString.split("~")[1];
    var val2 = dividedString.split("~")[0];
    
    var key = "";
    var characters="abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*(){}\":?><,./;]['-=_+";
      var keyCodeArr = ["TG","3F","LS","EI","TZ","QW","WK","T6","S0","JD","PQ","KO","8E","1R","HW","PA","0F","PE","Y4","IE","MD","VN","LW","WL","TG","3F","LS","EI","TZ","QW","WK","T6","S0","JD","PQ","KO","8E","1R","HW","PA","0F","PE","Y4","IE","MD","VN","LW","WL","TG","3F","LS","EI","TZ","QW","WK","T6","S0","JD","PQ","KO","8E","1R","HW","PA","0F","PE","Y4","IE","MD","VN","LW","WL","TG","3F","LS","EI","TZ","QW","WK","T6","S0","JD","PQ","KO","8E","1R","HW","PA","0F","PE","Y4","IE","MD","VN","LW","WL"];
      var val1Array = [];
      for (var i = 0;i < val1.length; i++){
          val1Array.push(""+val1.charAt(i));
      }
      var val2Array = [];
      for (var i = 0;i < val2.length; i++){
          val2Array.push(""+val2.charAt(i));
      }
  
      for(var i = 0;i < val1.length; i++){
        var j = i;
        if(i >= val2Array.length){j=0;}
          key += keyCodeArr[characters.indexOf(val2Array[j])]+""+val1Array[i];
      }
  
      if(key.length < 16){
          var needCharSize = 16-key.length;
  
          for(var i = 0;i < needCharSize; i++){
              key += keyCodeArr[(needCharSize-i)];
          }
      }
  
      if(key.length > 16){
          key = this.reverseString(key.substring(0, 16));
      }
  
      return key;
  }

  devideValue=(val)=>{
    var valLength = val.length;
	  var val1 = val.substring(0,Math.round(valLength/2));
	  var val2 = val.substring(Math.round(valLength/2));
	  return val1+"~"+val2;
  }

  reverseString=(str)=> {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]
 
    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]
 
    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"
    
    //Step 4. Return the reversed string
    return joinArray; // "olleh"
}
  //End of Encryption for AL//
  loginFunction = (e) => {
    e.preventDefault()
    //console.log(this.state.userInfo);
    let uInfo = this.state.userInfo;
    if (uInfo.userid !== '' && uInfo.userid.length >= 3 && uInfo.password !== '' && uInfo.password.length > 3 && uInfo.captcha !== '' && uInfo.captcha.length > 3) {
      let newObj = {};
      let capchadetails = {};
      newObj.userId = uInfo.userid;
      newObj.password = uInfo.password;
      newObj.pushToken = localStorage.getItem('pushToken');
      //const token = this.props.uD.token
      if(window.navigator.connection === undefined ){
        capchadetails.bandwidth =  "";
      capchadetails.userDomain = "";
      capchadetails.browserDetails =  "";
      capchadetails.osName = "";
      }else{
        capchadetails.bandwidth = window.navigator.connection.downlink || "";
        capchadetails.userDomain = window.top.location.hostname || "";
        capchadetails.browserDetails = window.navigator.userAgent || "";
        capchadetails.osName = window.navigator.appVersion || "";
      }
     

      capchadetails.entry = uInfo.captcha;
      capchadetails.entryid = this.state.capchaid;
      newObj.platform = "w";
      this.setState({ loader: true });

      let datas;
      if (newObj.userId.toLowerCase().startsWith("al@")) {
        var alusername=newObj.userId;
        var usermnamewithval = alusername.split("@")
        var aluserpwd = newObj.password;
        var secret = this.aesAlKeyGen(usermnamewithval[1]);
        //console.log(secret);
        var encrypted = CryptoJS.AES.encrypt(aluserpwd, secret);
        var encryptedval = encrypted.toString();
        //console.log(encryptedval);
        newObj.password = encryptedval;
		    //console.log(encrypted)
        datas = postDatalogin(apilist.alEmpLoginApi, newObj, capchadetails);
      } else {
        var usernameny = newObj.userId;
        var passMD5 = CryptoJS.MD5(usernameny).toString();
        var userenydata = newObj.password;
        var enypassword = passMD5;
        var ctObj = CryptoJS.AES.encrypt(userenydata, enypassword);
        var ctStr = ctObj.toString();
        //newObj.enypassword = newObj.password;
        newObj.password = ctStr;
        datas = postDatalogin(apilist.loginApi, newObj, capchadetails);
      }
      datas.then((dataVals) => {
        //console.log(dataVals);
        if (dataVals.statuscode === 200) {
          let firstvalss = dataVals.data.firsttimelogin;
          this.setState({ loader: false });
          userinfodate = dataVals;
          if ((!dataVals.data.firsttimelogin || dataVals.data.temppass) && !dataVals.data.unipass && dataVals.data.userrole !=="AL EMPLOYEE") {
            this.setState({
              disclaimer: firstvalss,
              tempPass: dataVals.data.temppass,
              tempuserid: dataVals.data.userid,
              tempusertoken: dataVals.data.token,
            });

          } else {
            this.props.ctrs();
            this.props.history.push(dataVals.data.ldpath); 
            

            if (uInfo.rememberMe) {
              let rememberUser = {}, jsonObj;
              rememberUser.userid = uInfo.userid;
              rememberUser.password = window.btoa(uInfo.password);
              rememberUser.rememberMe = uInfo.rememberMe;
              jsonObj = JSON.stringify(rememberUser);
              setLocalStorage("rememberUser", jsonObj)
            } else {
              removeLocalStorage("rememberUser")
            }
          }

        } else if(dataVals.statuscode === 204) {
          this.capchafn();
          uInfo.errorMsg = dataVals.message;
          this.setState({ userInfo: uInfo });
        }else {
          //console.log(dataVals);
          if (dataVals.statuscode === 400) {
            this.capchafn();
          }
          this.state.userInfo.captcha="";
          uInfo.errorMsg = dataVals.data.loginstatus;
          this.setState({ userInfo: uInfo });
        }
      });

    }
  }

  updateUserID = () => {
    let forgotInfo = this.state.forgotPassword;
    if (!forgotInfo.otp || forgotInfo.otp.length < 4) {
      alert("Please enter the valid OTP.");
      return false;
    } else if (!forgotInfo.updtpass || !forgotInfo.confpass || forgotInfo.updtpass !== forgotInfo.confpass) {
      alert("Please enter the valid password.");
      return false;
    } else if (forgotInfo.updtpass.length < 8 || !forgotInfo.updtpass.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,16}$/)) {
      alert("Please enter the valid password.\n" +
        "Acceptable formats \n" +
        "A to Z or a to z and 0 to 9 and \n any one special characters !@#$%^&*");
      return false;
    } else {
      let newObj = {};
      newObj.otp = forgotInfo.otp;
      newObj.uuid = forgotInfo.uuid;
      newObj.loginid = forgotInfo.loginid;
      newObj.updtpass = forgotInfo.updtpass;
      newObj.platform = 'w';
      const datas = postData(apilist.forgotpasstest, newObj);
      datas.then((dataVals) => {
        //console.log(dataVals);
        if (dataVals.statuscode === 200) {
          alert(dataVals.message);
          let updateVals = this.state;
          updateVals.userInfo.captcha = "";
          updateVals.userInfo.password = "";
          updateVals.userInfo.userid = "";
          this.closeVal();
        } else {
          alert(dataVals.message);
        }
      });
    }
  }

  componentDidUpdate(prevState, newState) {

    //console.log(this.state);
  }

  capchafn = () => {
    const datas = getData(apilist.capchaimg);
    datas.then((dataVals) => {
      //console.log(dataVals)
      if (dataVals.statuscode === 200) {
        this.setState({ imgsrc64: "data:image/png;base64," })
        this.setState({ capchaimg: dataVals.data.image_txt })
        this.setState({ capchaid: dataVals.data.id })
      }
    });
  }

  updateTnc = (val) => {
    let tncVal = false;
    if (val) {
      tncVal = true;
    }
    this.setState({
      tnc: tncVal,
      disclaimer: 1,
      tempPass: false
    });
  }

  agreed = () => {
    let disclObj = {};
    disclObj.platform = "w";
    disclObj.loginid = this.state.userInfo.userid;
    let vehtoken = this.state.tempusertoken;
    const datas = postData(apilist.disclaimerupdate, disclObj,vehtoken);
    datas.then((dataVals) => {
      //console.log(dataVals);
      if (dataVals.statuscode === 200) {
        this.setState({
          tnc: !this.state.tnc
        });
      }
    });

  }

  agreeTnc = (event) => {
    this.setState({
      tncCheckBox: event.target.checked
    });
  }

  updateNewpasswd = (event) => {
    let stateVal = this.state.resetPasswd;
    stateVal.newPasswd = event.target.value;
    this.setState({
      resetPasswd: stateVal
    });
  }

  updatePassword = () => {
    //console.log(this.state);
    //console.log(this.props);
    let resetObj = {};
    resetObj.loginid = this.state.userInfo.userid;
    resetObj.userid = this.state.tempuserid;
    resetObj.newpassword = this.state.resetPasswd.newPasswd;
    resetObj.confirmpass = this.state.resetPasswd.newPasswd;
    resetObj.token = this.state.tempusertoken;
    var tempassreset = this.state.tempusertoken;
    resetObj.platform = "w";

    if (!resetObj.newpassword) {
      alert("Please enter the valid password.");
      return false;
    } else if (resetObj.newpassword.length < 8 || !resetObj.newpassword.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,16}$/)) {
      alert("Please enter the valid password.\n" +
        "Acceptable formats \n" +
        "A to Z or a to z and 0 to 9 and \n any one special characters !@#$%^&*");
      return false;
    } else {
      const datas = postData(apilist.userpassreset, resetObj,tempassreset);
      datas.then((dataVals) => {
        //console.log(dataVals);
        if (dataVals.statuscode === 200) {
          let updateVals = this.state;
          updateVals.userInfo.captcha = "";
          updateVals.userInfo.password = "";
          updateVals.userInfo.userid = "";          
          alert("Password Updated Successfully");
          this.setState(updateVals);
          this.updateTnc(0)
        } else {
          //console.log(dataVals);
        }
      });
    }
  }
  showpassfn =()=>{
    if(this.state.userInfo.passshows === "password"){
      this.state.userInfo.passshows= "text";
      this.state.userInfo.clspassshow=false;
    }else{
      this.state.userInfo.passshows= "password";
      this.state.userInfo.clspassshow=true;
    }
  }
  handleModalClose = (e) => {
    if (e.target.id === 'login-modal-container-id') {
      this.props.closeModal(false)
    }
  }

  render() {
    return (
      <div id="login-modal-container-id" className="login-modal-container" onClick={this.handleModalClose}>
        <div className="login-modal">
          <img className="login-modal_ialertLogo" src="/images/newLandingPage/ialert-white.png" alt="logo" />
          
          <form className="login-modal_form" onSubmit={this.loginFunction} >
            
            <div>
              <TextField
                id="outlined-basic"
                type="text"
                name="userid"
                onChange={this.handleuserVals}
                value={this.state.userInfo.userid}
                label="Login ID / Mobile Number"
                variant="outlined"
                size="small"
                required
              />
            </div>
            <div>
              <TextField
                id="outlined-basic"
                type={this.state.userInfo.passshows}
                name="password"
                value={this.state.userInfo.password}
                label="Password"
                onChange={this.handleuserVals}
                variant="outlined"
                size="small"
                required
              />
              <div className="showpasscls">{this.state.userInfo.clspassshow === true?<i className="fa fa-eye-slash" onClick={this.showpassfn} aria-hidden="true"></i>:<i class="fa fa-eye" onClick={this.showpassfn}></i>}</div>
            </div>
            <div className="login-modal_captch-container" >
              <TextField
                id="outlined-basic"
                type="text"
                name="captcha"
                label="Captcha"
                inputProps={{
                  maxLength: 6,
                }}
                required
                onChange={this.handleuserVals}
                variant="outlined"
                size="small"
                value={this.state.userInfo.captcha}
              />
              <div className="login-modal-form_captcha-container">
                <p className="login-modal-form_captcha">
                  <img
                    alt="captcha"
                    src={this.state.capchaimg ? "data:image/png;base64," + this.state.capchaimg : ""}
                  />
                </p>
                <i className="fa fa-refresh fa-2 login-modal-form_refresh" onClick={this.capchafn} ></i>
              </div>

            </div>

            <div className="login-modal_remember-container">
              <p  style={{ display: 'inline' }}>
                <Checkbox
                  id="rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  checked={this.state.userInfo.rememberMe}
                  onChange={this.handleuserChecked}
                />
                <label className="login-modal_rememberme" htmlFor="rememberMe">Remember me</label>
              </p>

              <button
                type="submit"
                disabled={this.state.userInfo.loginDisable}
                className={this.state.userInfo.loginDisable ===true ? "logins-btn-disable" : "logins-btn"}
              >
                Login
              </button>

              {/* <input
                type="button"
                disabled={this.state.userInfo.loginDisable}
                value="Login"
                className={this.state.userInfo.loginDisable ===true ? "logins-btn-disable" : "logins-btn"}
                onClick={this.loginFunction}
              /> */}
              
            </div>
            <div className="row errorboxs">
            <div className="col-md-12 errorboxslist"><span>{this.state.userInfo.errorMsg}</span></div>
            <div className="col-md-12 remembermetext" style={{ display: 'flex', flexDirection: 'row-reverse',marginTop:'-7%',color:'#427ae6' }}>
            <span
                className="cursor-pointer login-modal_forgot"
                onClick={this.forgotPassword}
              >
                Forgot password/Unlock Account
              </span> 
            </div>
            </div>
            
            
          </form>
          <p className="login-modal_terms">
            By logging in you agree to our
            <span className="acolor" onClick={() => this.updateTnc(1)}>
              Terms &amp; Conditions
            </span>
          </p>
          <p className="recommended-version">Recommended Browser: Google Chrome > 63.0 version <span className="networkspeed-md">Network Speed: Minimum 2 Mbps</span></p>
          <div className='popup' style={this.state.forgotPassword.isVisible ? { display: 'block' } : { display: 'none' }}>
            <div className='popup_body'>
            <div className="popup_header">
                                <p className="text-right"><span className="" style={{ cursor: "pointer" }} onClick={this.closeVal}>&#x2716;</span></p>
                                <p><strong>Forgot Password / Unlock Account</strong></p>
                                <br />
            </div>
            {
              !this.state.forgotPassword.otpBlock ? (
                <div className="popup_content" >
                  <div className="row" >
                    <div className="col-md-7 md-offset-5">
                      <p className="inputContainer">
                        <input type="text" name="forgotUserId" placeholder="Name" maxLength="20" required onChange={this.updateForgotInfo} value={this.state.forgotPassword.forgotUserId} />
                        <label>Login ID/ Mobile Number<span className="red">*</span></label>
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="button-container">
                        <p className="inputContainer pull-right">
                          <span className="w200"><input type="button" className="submitButton" name="submit" value="Submit" onClick={this.validateUserID} disabled={this.state.forgotPassword.forgotDisable} /></span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                  <div className="popup_content">
                    <div className="row" >
                      <p style={{ marginLeft: '15px', paddingBottom: '15px' }}>Your OTP has been sent to your registered mobile No {this.state.forgotPassword.mob}</p>
                      <div className="col-md-7 md-offset-5">
                        <p className="inputContainer">
                          <input type="text" name="otp" placeholder="Enter your OTP" maxLength="4" required onChange={this.updateForgotInfo} value={this.state.forgotPassword.otp} />
                          <label>Enter your otp<span className="red">*</span></label>
                        </p>
                        <p className="inputContainer">
                          <input type="password" autocomplete="off" name="updtpass" placeholder="New Password" maxLength="20" required onChange={this.updateForgotInfo} />
                          <label>New Password<span className="red">*</span></label>
                        </p>
                        <p className="inputContainer">
                          <input type="password" autocomplete="off" name="confpass" placeholder="Confirm Password" maxLength="20" required onChange={this.updateForgotInfo} />
                          <label>Confirm Password<span className="red">*</span></label>
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="button-container">
                          <p className="inputContainer pull-right">
                            <span className="w200"><input type="button" className="submitButton" name="submit" value="Update Password" onClick={this.updateUserID} /></span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>)
            }
            </div>            
          </div>
          {
            !this.state.disclaimer && (
              <div className="disclaimer">
                <div className="popup_cont">
                  <div className="head_level">
                    <p className="text-center">DISCLAIMER</p>
                    <p className="closeVal" onClick={() => this.sentToNext(0)}>x</p>
                  </div>
                  <div className="popupbody">
                    <p>Data displayed above is near real time / delayed and not live data. Data shown is indicative. Customer to always check the prevailing actual conditions from the vehicle only. Ashok Leyland shall not be liable for either accuracy of the indicative Data nor any actions taken based on the Data displayed in the applications.</p>
                    <p className="text-right"><span className="commonbut cursor-pointer" onClick={() => this.sentToNext(1)}>Continue</span></p>
                  </div>
                </div>
              </div>
            )
          }
          {
            this.state.tnc && (
              <div className="tnc">
                            <div className="popup_cont">
                                <div className="head_level">
                                    <p className="text-center">TERMS AND CONDITIONS</p>
                                    <p className="text-center">i-Alert Telematics Business Unit</p>
                                    <p className="closeVal" onClick={() => this.updateTnc(0)}>x</p>
                                </div>
                                <div className="popupbody">
                                    <div className="row">
                                    <div className="col-md-6">
                                    <p><strong>1. Definitions</strong></p>
                                    <p>1.1.	"Company" means Ashok Leyland Ltd, Connected Vehicles business Unit having its registered office at No-1, Sardar Patel Road, Guindy, Chennai - 600032. (Hereinafter called "ALL", which expression includes its successors and assigns). 1.2. "Charges" shall include such payments which are due and payable by the subscriber to the Company, whether billed or not, inclusive of the fees, charges, rates, taxes, levies, penalties, fines for providing the service to the subscriber pursuant to the subscriber's enrolment and make subscription to the service as per the tariff agreed upon by customer in the CAF / contract. "Tariff" shall mean the tariff schedule including but not limited to fees, charges, rates and related conditions as notified and published by ALL from time to time for providing the Services. 1.3. "Customer or Subscriber" shall mean any individual person, company, proprietorship or partnership firm or any other association of persons or entity of whatever nature, who/which has subscribed for the services under CAF and include subscriber's heirs, executors, administrators, successors and permitted assigns. The term Customer includes owner of the vehicles, fleet manager and driver of the vehicles as the context requires. 1.4. "Due Date" shall mean the date prescribed by the Company in the bill/statement of charges for making payment of the bill amount by the subscriber. 1.5. “Intellectual Property” means and includes all copyright, patents, database rights and rights in trademarks, designs, know-how and confidential information (whether registered or unregistered); and all other intellectual property rights and equivalent pertaining to the web Services, Mobile Application (as the case may be) including the data generated on the web or Mobile Application, online portal (by whatever name called) and also the rights pertaining to hosting or making the Mobile Application, Services available on any app store, device or server. 1.6. “Mobile Application” shall mean the various mobile application owned by the Company and hosted as a part of the iALERT platform from time to time. 1.7. "Network" shall mean telecommunication network through which services are made available. 1.8. "Service(s)" shall mean vehicle tracking services, vehicle related data, acquisition and communication services, which may be offered by the Company. Services include the various monitoring, scoring , reports and other features offered by ALL through mobile application (s) and website(s) . 1.9. "Subscriber equipment" mean any compatible Telematics Device necessary for transmitting vehicle location and other vehicle related data to the central base station in order to avail the services and approved for use by the Company, whether owned or not by the subscriber. The Telematics device is also referred as On-Board Unit (OBU). </p>
                                    <p><strong>2. Provision for Services</strong></p>
                                    <p>2.1 Services shall be available at all times subject to Force Majeure conditions including but not limited to act of God, fires, strikes, embargoes, war, insurrection, riots and other causes beyond the reasonable control of the Company including atmospheric / geographical hindrances. 2.2 Company may temporarily suspend whole or part of the Services at any time without notice, if the infrastructure or telecommunication network fails or requires modifications or maintenance. The Subscriber will remain liable to pay for all charges during the period of suspension. 2.3 These terms and conditions shall become effective upon ALL, at its sole discretion, accepting after due verification, the application of the subscriber attached herewith, and shall continue to remain in force until terminated. The services will be activated only after customer provides the CAF – Customer Application form (or) Activation clearance that forms part of the Vehicle Invoice to the company or its authorized Dealer in the form of physical copy or through email and upon payment of full subscription fees to ALL. However, the Services shall be provided by ALL upon request from the Customer upon reasonable time which may be extended by ALL on case to case basis based on feasibility. 2.4 The Company reserves the right to reject any request / application for any reason without any liability. The information provided by the subscriber/ gathered by ALL shall become the ALL's property even if the application is rejected. 2.5. Company provides user the credentials to the Owner of the vehicles to access the web / mobile application and to avail the Services. It shall be the responsibility of the Owner of the vehicles not to divulge the information to any third party. In the event the Owner of the vehicles shares or authorizes any third party including the fleet manager to the use the web or mobile application and the Services it shall be at the sole responsibility of the Owner of the vehicle and for any unauthorized usage the Company shall not be liable for any consequences of whatsoever nature. 2.6. The Company reserves its right to further develop the Services or features of the web / mobile Application without any notice or any obligation to the Subscriber, AL shall be the sole and absolute legal owner of any future development of the Web / Mobile Application or any feature to the same. </p>
                                    <p><strong>3. Subscriber Equipment</strong></p>
                                    <p>3.1. Functionality of the Equipment and/or Service is subject to the functionality and limitations of the global positioning system, wireless networks, carrier services, and the Internet which is beyond Ashok Leyland's control. 3.2. The Equipment/Service will go into a "sleep" mode after approximately 1 hour of nonuse and will not operate until the ignition in the vehicle in which the applicable Equipment is installed is started 3.3. The Equipment does not collect and store data in real time and delays in receipt of data are subject to external factors. Wireless networks and coverage, satellite coverage, and Internet access that are necessary for use and operation of the Equipment and/or Service may be interrupted, terminated or restricted or the quality of the transmission may be diminished at any time. 3.4. Actual coverage and operation of the Service may depend on system availability and capacity, system and Equipment upgrades, repairs, maintenance, modifications and relocation, Owner of the vehicle's equipment, terrain, signal strength, structural conditions, weather and atmospheric conditions, governmental regulations, suspected fraudulent activities, natural calamities/acts of God, strikes and other conditions beyond Ashok Leyland's reasonable control and neither party will be liable for any failure or delay in performing any of its obligations mentioned in this document 3.5. The Equipment/Service and the notifications emanating from the mobile devices is to be used only as an aid in assisting, planning, monitoring and reporting by the user. ALL shall not be liable for any disruptions or alerts caused to the driver because of the notifications which may emanate from mobile device while driving and driver shall exercise his skill and caution while utilizing the Mobile Application. As with any maps or driving directions or notifications, Owner / driver of the vehicle should always recheck directions and prevailing driving conditions for accuracy and confirm that the road still exists, be aware of diversions, constructions activities and other hazards, initiate any actions and follow all safety precautions and follow prevailing laws. 3.6. The subscription will be terminated in case of any tampering or damage to the device/Subscriber Equipment with mala-fide intention of disrupting the services. 3.7. The customer shall permit ALL and its authorized agencies to inspect the device/Subscriber Equipment and render necessary service support to ensure proper functioning of the device at all times. 3.8. Subscribers shall without any objection accept the OBU allotted by the Company. The discretion with regard to the choice of OBU to be allotted shall solely and absolutely vest with the Company. The SIM card which forms the part of the OBU remain as the exclusive property of the Company, the subscriber being licensed to use it to transmit the location data to the tracking infrastructure through the network and shall be deemed to have been returned by the subscriber on the termination / disconnection / surrender of the service. 3.9. The Company's OBU is non-transferable unless and until the subscriber seeks prior permission from the Company for intended transfer and comply with the formalities of the Company. 3.10. The Subscriber shall allow the Company representative at all reasonable times to attend and inspect the Telematics Unit. 3.11. Replacement of defective OBU shall be as per the Warranty Policy of the Company 3.12. After the Warranty period the subscriber may opt for Annual Maintenance Contract Service (AMC) of OBU at price fixed by the Company which price shall be binding on the Subscriber. </p>
                                    <p><strong>4. Installation of Mobile Application</strong></p>
                                    <p>4.1. It shall be the obligation of the owner / driver of the vehicle to install the relevant Mobile Application on his mobile from online mobile application store. The owner / driver shall ensure that the mobile equipment used shall have minimum feature to download and access the mobile application. 4.2. Customer understands the same and unequivocally agrees that the Services shall be available only if the mobile has these minimum features. Minimum features required for usage of Mobile Application shall be updated from time to time and it shall be the obligation of the Customer to accordingly upgrade their mobile devices at their own costs and expenses. 4.3. For installing the Mobile Application in the mobile device a onetime password (OTP) will be generated, the Customer (including its driver) of the vehicle expressly agrees not to share the OTP to any person and the Company shall not be responsible for any consequences arising due to sharing of such OTP’s. </p>
                                    <p><strong>5. Consent to Use Data of the Customer, Driver and Vehicle:</strong></p>
                                    <p>5.1. The Customer hereby provides express and unlimited consent to use the data which has been uploaded using the web / mobile application(s), website(s) and server of the Company towards providing the Services. The data for which express consent is provided by the owner of vehicle, fleet manager and driver. 5.2. The data which may be derived shall include the driver’s Name, image, mobile number, driving license details, address, date of birth, Aadhaar card details and other related details as uploaded in the website by the user. 5.3. The owner of the vehicle, fleet manager and driver of the vehicle expressly hereby authorise the Company to share / use the vehicle related performance and behavior details such as KMPL of the vehicle, all technical performance details of the vehicle and other related details to the driver of the vehicle. 5.4. By providing the vehicle and Customer related data / vehicle performance related information to the driver, ALL shall not be liable to the owner of the vehicle in any manner whatsoever nature to the any owner of the vehicle. 5.5. The Customer hereby expressly authorise AL to use the data, information which are extracted and provided through this Web / Mobile Application to commercially monetize the same at present and in the future by creating any digital platforms or through any other mode. Further, the data and information which are provided may be shared with third parties for any purpose of whatsoever nature. The Customer shall have no claim either monetary or otherwise against AL, its subsidiaries, its directors or any of its employees. </p>
                                    <p><strong>6. Sharing of Data with Statutory / Government authorities:</strong></p>
                                    <p>6.1. Customer hereby expressly consents that the Data which is provided for providing the Services will be shared by ALL if the same is requested or required pursuant to legal process or is required to be disclosed by law, or regulation, Warrants or court order. 6.2. The Customer expressly consents and permits that the Data which are provided by the Customer shall be shared with law enforcement agencies (including police) as required by them. </p>
                                    <p><strong>7. Consent for Ranking the performance of Drivers:</strong></p>
                                    <p>7.1. The owners and fleet managers of the vehicles hereby expressly authorize and provide their consent to rank the performance of the drivers based on their scores and performance of the vehicle including various other criteria’s as may be decided by ALL from time to time. 7.2. Ranking of the drivers shall also include publishing the drivers name and photographs in the dashboards and related portal, the owners and fleet managers hereby expressly provide their consent to the same.  </p>
                                    <p><strong>8. Rights and Liabilities of the Company</strong></p>
                                          <p>8.1. The Company shall be responsible for providing the services to the subscriber mentioned in the CAF/application form. 8.2. In any event, the maximum overall liability of the Company in contract, tort or otherwise, shall be to refund the subscription amount after adjusting the charges due from the subscriber. Without prejudice, in no event shall the Company, its officers, Employees, directors, its representatives and assigns be liable for any direct, indirect or consequential damages, costs, expenses or losses of whatsoever nature, including but not limited to, loss of profit or loss of business pertaining to the provision of the service to the subscriber. 8.3. Ashok Leyland shall take necessary precautions to notify the subscriber in case of a scheduled shut down of services. However, in case of an unforeseen shut down without notice to the Subscribers due to IT infrastructure failure or due to Internet Link failures or shutdown owing to statutory regulations or natural calamities, ALL shall not be liable for any compensation to the subscriber for any Data Loss or any consequential losses. 8.4. The Company shall not be responsible for any act of commission or omission of any third party / supplier / manufacturer / agency / Company offering any privilege or benefit to the subscriber without express permission or authority of the Company. 8.5. The data collected by i-ALERT services through OBU, mobile applications, online portals from the vehicles shall be used by Ashok Leyland, its Dealer network, service providers and affiliates to provide need-based services to the Customer 8.6. The company hereby makes it explicit that it does not guarantee 100% availability of the service all the time. 8.7. Company and its authorized network will have the access rights to get information / data on locations of vehicles sold by it or within its territory due for service / attention and will have access to the vital information for the purpose of prognostics / diagnostics in order to support the customer in faster response and restoration of the vehicle. The Subscriber acknowledges this feature and gives consent for usage of the data for the above purposes. 8.8. The services comprise of remote diagnostics, prognostics, vehicle performance and driver performance reports in order to understand and assist customer in improving his uptime and vehicle performance. 8.9. Company is entitled after prior intimation and confirmation change, vary, add, withdraw any service and /or change, vary, add, alter, delete, withdraw any/all charges, discounts, due dates, surcharge, tariff, etc., at any point in its sole discretion for one or more or all of its subscribers except in the case of discounts or other special benefits or scheme/plans announced by the Company from time to time and which are valid for specified periods. </p>
                                          
                                    </div>

                                    <div className="col-md-6">
                                      <p> 8.10. The Company shall reserve the right to transfer or assign and / or delegate all or part(s) of its obligations, rights and /or duties under these terms and conditions to any party. Such transfer / assignment shall release the Company from all liabilities under these terms and conditions. 8.11. The Company may be required to disclose any information or particulars pertaining to the Subscriber to any Authority, statutory or otherwise, including but not limited to, any security agencies and reserves the right to comply with the directions of such authorities at its discretion and without intimating the Subscriber. 8.12. The Company reserves the right to seek / verify particulars provided by the subscriber to the Company, in any manner without notice or intimation. 8.13. The Company reserves the right to raise and /or collect bills / statement of charge for services by itself directly or through any of its nominees, agents and franchisees. The Company may vary its billing cycle at any time without any prior intimation. The Company represents that irrespective of the agency that raises the bill / statement of charge, once the subscriber has paid the amount due, to the company or any of its authorized agencies for collection. It shall be deemed to have been paid to the Company. 8.14. The Company reserves the right to provide services through its agents and franchisees. 8.15. The Company shall unless the subscriber indicates otherwise send promotional material to subscriber via secured electronic media, which or otherwise include text messages, multimedia content, pictures, emails and voice. 8.16. The Company reserves the right to access anytime any/all the vehicle and customer account related data stored in the OBU, anywhere in the network or in its infrastructure. 8.17. The Company assumes no responsibility for Owner of the vehicle's improper storage of data or information or delivery of messages.</p>
                                       <p><strong>9. Warranties, Rights and Liabilities of Subscriber</strong></p>
                                          <p>9.1. Subscriber shall pay all charges in full without any reduction set off or withholding in respect of the services availed upon authorization by the subscriber. 9.2. Subscriber is not entitled to transfer or assign its obligations and liabilities under the terms and conditions to any other party under any circumstances without prior permission of the Company. Any transfer affected in contravention of the express terms contained herein shall not absolve the subscriber of his obligations/liabilities towards the Company for charges levied against the subscriber. 9.3. Owner of the vehicle assumes the entire risk in downloading or otherwise accessing any data, information, files or other materials obtained from the Ashok Leyland website and shall pay telecommunication charges directly to their respective telecommunication service providers. 9.4. Owner of the vehicle acknowledges that use of the Equipment and/or Service may have Owner of the vehicle data privacy implications. 9.5. Whether, and to what extent, an Owner of the vehicle's privacy rights are implicated may be affected by such things as: the use to which the Service is put; the information that is gathered by the Service; the dissemination of information that is gathered; the actions that are taken based upon the information gathered; the Owner of the vehicle's knowledge and/or consent to such monitoring; the policies and procedures that have been implemented and communicated by the administrator; and current central and state laws, regulations and constitutional rights applicable to the Owner of the vehicle. 9.6. The customer acknowledges that the company has the right to have internal access to and track and / or all of the vehicles and its related data at all times to support and service its i-ALERT Service and its Subscribers. 9.7. The owner agrees to provide necessary permissions & consent to share all the above data for the above purposes 9.8. Subscriber shall not use the service for any improper, immoral, unlawful or abusive purpose or for sending obscene, indecent, threatening, harassing, and unsolicited messages to create any damage to the Company or any other person whomsoever. Any such misuse shall under no circumstance be attributed to the Company and the subscriber shall be solely responsible for such acts. Subscriber hereby agrees to indemnify and hold harmless the Company and its agent and franchisees from all suits, proceedings, costs, damages or claims of any kind arising out of any act or omission or misuse of the service by the subscriber or any other person with or without the consent of the subscriber. 9.9. All taxes present and future and any other additional tax / cess / duty levied by authorities from time to time shall be to the account of subscriber. 9.10. Subscriber shall remain liable for all applicable charges during temporary suspension / discontinuation of services. Reconnection of the services shall be at a cost, as decided by the Company from time to time. 9.11. The Subscriber shall keep the company informed of any updates or any changes in any information given in CAF by quoting the CUSTOMER ID and the changes to be made by Registered post or e-Mail with the sign of the authorized signatory with official stamp and seal 9.12. In the event of there being any deficiency in the services, the Subscriber shall intimate within a period of seven (7) days of the occurrence of the deficiency to the Company and there upon the Company shall endeavor to rectify the same within a reasonable period. All such correspondence should be addressed to Ashok Leyland Ltd, 1, Sardar Patel Road, Guindy, Chennai. or via email to alert.care@ashokleyland.com. </p>
                                          <p><strong>10.	Billing</strong></p>
                                          <p>10.1. The Company shall send the bill / statement of charges either through the electronic media (including emails) or through hard copy and it shall be deemed to have been received by the subscriber. 10.2. Subscriber shall pay the bill / statement of charges on or before due date. It is the responsibility of the Subscriber to enquire about the amount payable and settle the same in case of non-receipt of bill / Statement of charges. 10.3. In case any charges are disputed, the subscriber shall intimate the Company within two (2) days of receipt of bill / statement of charge. In case of non-receipt of such information, the charges will be presumed to have been accepted. Subscriber shall pay full amount of disputed charges, pending settlement of dispute. 10.4. The Company's acceptance of payment from a person other than the subscriber shall not amount to the Company having transferred or modified any of the rights of applications of the subscribers to any third party. 10.5. The subscription is non-transferable, and charges paid are non-refundable </p>
                                          <p><strong>11. Suspension / Termination / Discontinuation of services</strong></p>
                                          <p>11.1. Service quality functionality availability and/or reliability may be affected and/or the Company is entitled to, without any liability to refuse, limit, suspend, vary, disconnect and/or interrupt the services in whole or in part, at any time in its sole discretion with respect to one/all subscribers without any notice for any reason and/or due to various factors including but not limited to: 11.1.1. Changes in the law, rules, regulations of order, directions, notifications etc. by the authorities. 11.1.2. Transmission limitation caused by physical obstruction, geographic, topography, hydrological, metrological and other causes of radio interference or faults or disruption in telecommunication service provider to which ALL network is connected. 11.1.3. Force Majeure circumstance. 11.1.4. Any discrepancies / wrong (s) provided by the subscriber. 11.1.5. Delayed / Non-payment of bill / statements of charges. 11.1.6. Default in the payment of any financier who has tied up with the Company to provide finance to its subscriber. 11.1.7. Misuse of the OBU or SIM card by the Subscriber or their representatives. 11.1.8. In case of misuse of services or breach of any terms and conditions by the subscriber or use of services in such manner that it violates any laws or adversely affects or interferes with the Company service, Company shall give notice of five (5) days to the subscriber to remedy the breach. In case the subscriber fails to remedy the breach within the notice period, the Company is entitled to disconnect the services without any further notice. 11.1.9. In other case the Company at its sole discretion may suspend / discontinue the services by giving reasonable notice to subscriber in such form as may be decided by the Company. 11.1.10. In case the Subscriber opts for discontinuation of services, the Subscriber needs to pay for the period till services are availed & the Company shall refund to the Subscriber the amount paid in advance to the Company at the time of availing of the services, after adjustment, if any under any circumstances.  </p>
                                          <p><strong>12. Obligations of the Subscriber</strong></p>
                                          <p>Subscriber hereby agrees 12.1. To the extent relevant, subscriber hereby confirms that he will be bound by the same terms and conditions in addition to special terms and conditions as mentioned herein for the OBU supplied by ALL. 12.2. Subscriber shall be permitted to avail the services only by means of the OBU approved for use by the Company for the purpose of transmitting location information and vehicle related data to the base station through network. 12.3. The Subscriber shall not directly or indirectly disclose or otherwise provide any Confidential Information relating or sublet or issue to the i-ALERT Services to any third party and such permission shall result in termination of the Services without notice. 12.4. Ashok Leyland shall not be responsible for any unauthorized use of the i-ALERT Services or misuse of password and any consequential loss of data or damages. The subscriber shall be solely responsible for the safe use of the i-ALERT service. Service. The Customer agrees that it shall not share the password with any person and shall be responsible for all consequences which may arise for sharing or leaking the password. 12.5. Only subscriber's authorized personnel shall be permitted to access the services through internet or mobile phones or call center or any other mechanism to be decided by ALL from time to time. Any attempt to access the services by any/all personnel other than the authorized personnel of the subscriber will deemed to breach of the agreement and liable to legal proceedings. 12.6. In case the subscriber OBU is lost, misplaced or stolen, the subscriber shall inform the Company immediately. The Company takes no responsibility of the misuse of the lost, misplaced or stolen subscriber OBU or any damage with the same. A fresh OBU shall be activated after receiving the fresh application with due formalities and on acceptance of the terms and conditions laid thereof, from the subscriber along with a copy of FIR lodged for the loss, misplaced or stolen OBU. OBU tampering of any sort will render void of the warranty.</p>
                                          <p><strong>13. Intellectual Property:</strong></p>
                                          <p>13.1. Other than specifically provided in these terms, no right or license is granted to the Customer under any Intellectual Property of the Service, trademarks, Mobile Application, including any patent or patent application and no other right or license to use Confidential Information is granted hereby. The Service provided by the Company to the Customer shall in no manner be construed, in any way to confer/grant/license any right over any Intellectual Property of the Services or Mobile Application. 13.2. All content or data in the Mobile Application, website portal/application including but not limited to the text, music, sound, photograph, videos, graphics and images are governed and protected by the Indian Copyright Act, 1957 and subsequent amendments, the Trademark Act, 1999 and the subsequent amendments, and other all laws relating to Intellectual Property. 13.3. None of the content on the website portal, Mobile Application be downloaded, copied, reproduced, republished, posted, transmitted, stored, sold or distributed without the prior written permission of the Company. 13.4. The Customer shall not use, copy, reproduce, republish, upload, post, transmit, distribute, or modify such Intellectual Property of the Company in any way, including in advertising or publicity or on any other website or network computer environment, without the express prior written consent of the Company. .</p>
                                          <p><strong>14. Validity</strong></p>
                                          <p>14.1. The validity, construction and performance of terms and conditions herein shall be governed and interpreted in accordance with the laws of India and the Company and Subscriber agree to submit to the exclusive jurisdiction of the Chennai courts. 14.2. Should any provision of therein be or become ineffective or beheld to be invalid, this shall not affect the validity of the remaining provision hereof. 14.3. Unless or otherwise expressly stated, the terms defined in the terms and conditions, include the plural as well as the singular, masculine as well as feminine and natural person is deemed to include any Company, partnership, joint venture, association, corporation or any other body of government agency. 14.4. In case two or more persons constitute the subscriber, their liability shall be joint and several. 14.5. These terms and conditions read with CAF and the special tariff terms and conditions if any, is the complete understanding between the Company and the subscriber hereto and it supersedes all prior understanding whether oral or written and all representations and other communications between the Company and the subscriber hereto in case of any discrepancies between these terms and conditions and tariff, the later shall prevail. 14.6. These terms and conditions are subject to the Information Technology Act, 2000 and Indian Telegraph Act of 1885, Indian Telegraph Rules and regulations framed there under and any statutory amendments/modifications or reenactment for the time being in force and also subject to the statute, rules and regulations and guidelines as may be enforced from time to time. 14.7. Unless / otherwise specially provided by the Company, no delay or failure to provide services or to exercise any of his rights shall impair such rights or shall be construed to be a waiver by the Company. </p>
                                          <p><strong>15. Undertaking</strong></p>
                                          <p>I wish to confirm / declare / undertake as under: 15.1. I have read and understood the details / terms and conditions of ALL Services and agreed to abide / bound by the same. 15.2. I further declare that the particulars stated by me in the CAF, Invoice documents and details provided by me are true and correct. In case of any of them are found to be false and incorrect, ALL has the right to suspend / disconnect the Services. I will be liable to return the vehicle mounted unit and pay to ALL as per the terms and conditions. 15.3. I agree to provide necessary permissions & consent to share all the data generated from the OBU to ALL and its authorized network for its internal use as defined in the terms and conditions. 15.4. I further declare that I have understood and willfully chosen the tariff plans and agree to be bound and pay monthly charges towards the services as per plan. 15.5. I agree that if I fail to pay my Annual subscription on the due date, ALL shall be within its rights and powers to discontinue the Services upon which I shall be responsible for paying the charges as described 15.6. I undertake that the Services will be used by me for my own vehicle purpose and I will not sublet or issue to any third party without permission of ALL.</p>
                                        </div>
                                        {
                                            this.state.tempPass ? 
                                            <div className="col-md-12">
                                              <p><input type="checkbox" value="checked" onClick={this.agreeTnc} name="tncCheckBox" /> &#x00A0; I have read the Terms and conditions</p>
                                              <p className="text-right"><button name="agree" disabled={!this.state.tncCheckBox} className="submitButton agreebut" onClick={this.agreed} >Agree</button> &#x00A0; <button name="disAgree" className="submitButton agreebut" onClick={() => this.updateTnc(0)}>Disagree</button></p>
                                            </div> :
                                            <div className="col-md-12">
                                              <p className="text-right">
                                                <button name="agree" className="submitButton agreebut" onClick={() => this.updateTnc(0)} >Continue</button>
                                              </p>
                                            </div>
                                        }
                                        
                                    </div>
                                </div>

                            </div>
                        </div>
            )
          }

          {
            this.state.tempPass && !this.state.tnc && this.state.disclaimer && (
              <div className="resetPassword">
                <div className="popup_cont">
                  <div className="head_level">
                    <p className="text-center">Reset Password</p>
                    <p className="closeVal" onClick={() => this.updateTnc(0)}>x</p>
                  </div>
                  <div className="popupbody">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="col-md-6">
                          <p className="inputContainer">
                            <input type="text" name="newPasswd" placeholder="Update New Password" maxLength="16" required value={this.state.resetPasswd.newPasswd} onChange={this.updateNewpasswd} />
                            <label>New Password <span className="red">*</span></label>
                          </p>
                        </div>
                        <p className="text-right"><button name="update" className="submitButton updatePasswd cursor-pointer" disabled={this.state.resetPasswd.newPasswd.length < 7} onClick={this.updatePassword}>Update</button></p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )
          }
        </div>
      </div>
    )

  }
}

const mapStateToprops = state => {
  return {
    ctr: state.vehicledata.results,
    uD: state.userdata.id
  };
}

const mapdispatchToprops = dispatch => {
  return {
    ctrs: () => dispatch({ type: 'INCREMENT', value: userinfodate.data }),
    closeModal: payload => dispatch({ type: actionTypes.TOGGLE_LOGIN, payload })
  };
}



export { userinfodate };
export default connect(mapStateToprops, mapdispatchToprops)(withRouter(LoginModal));
