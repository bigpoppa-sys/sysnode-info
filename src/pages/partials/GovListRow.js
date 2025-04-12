import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import ReactTooltip from 'react-tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';

export class GovListRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataload: 0,
      rowData: [],
      enabled: 0
    };
  }

  componentDidMount() {
    this.setState({
      dataload: 1,
      rowData: this.props.govRowData,
      enabled: this.props.enableVal
    });
  }

  comaToNum = (str) => {
    return Number(str.replace(",", ""));
  }

  render() {
    const { t } = this.props;

    if (this.state.dataload === 1) {
      const rowdata = this.state.rowData;
      let final_url = rowdata.url && rowdata.url !== 'emptyField' ? rowdata.url : "/404";
      const enabled = this.comaToNum(this.state.enabled);
      const milliseconds = rowdata.CreationTime * 1000;
      const dateObject = new Date(milliseconds);
      const humanDateFormat = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;

      const start_date = moment.unix(rowdata.CreationTime);
      const end_date = moment.unix(rowdata.end_epoch);
      const num_months = (end_date.year() - start_date.year()) * 12 + (end_date.month() - start_date.month());

      let pass = "";
      if (((rowdata.YesCount - rowdata.NoCount) / enabled) * 100 > 10) {
        pass = <i className='fa fa-check greenIcon' data-tip={t('govlist.table.green_text')}></i>;
      } else {
        const need = parseInt((enabled / 10) - rowdata.AbsoluteYesCount);
        const new_text = t('govlist.table.red_text').replace("[API]", need);
        pass = <i className='fa fa-times redIcon' data-tip={new_text}></i>;
      }

      const green_comment = (
        <p>
          <CopyToClipboard text={'gobject_vote_many ' + this.props.hashKey + ' funding yes'} onCopy={() => alert('Copied to Clipboard')}>
            <button type="button" className="copybtns greenIcon">Copy Yes <i className='fa fa-check'></i></button>
          </CopyToClipboard>
        </p>
      );

      const red_comment = (
        <p>
          <CopyToClipboard text={'gobject_vote_many ' + this.props.hashKey + ' funding no'} onCopy={() => alert('Copied to Clipboard')}>
            <button type="button" className="copybtns redIcon">Copy No <i className='fa fa-times'></i></button>
          </CopyToClipboard>
        </p>
      );

      return (
        <tr className='vrRows'>
          <td className='text-center'><ReactTooltip />{pass}</td>
          <td>
            {rowdata.name}<br />
            <a href={final_url} target='_blank' rel='noopener noreferrer'>
              <span className="badge badge-success">{t('govlist.table.view_proposal_txt')}</span>
            </a>
          </td>
          <td>{rowdata.title}</td>
          <td>{humanDateFormat}</td>
          <td>{parseFloat(rowdata.payment_amount)} SYS</td>
          <td>{parseFloat(rowdata.payment_amount)} SYS/Month<br />{num_months} Month(s)</td>
          <td>{(rowdata.YesCount / (rowdata.YesCount + rowdata.NoCount) * 100).toFixed(2)}%<br />{rowdata.YesCount} Votes</td>
          <td>{(rowdata.NoCount / (rowdata.YesCount + rowdata.NoCount) * 100).toFixed(2)}%<br />{rowdata.NoCount} Votes</td>
          <td>{(rowdata.AbsoluteYesCount / enabled * 100).toFixed(2)}%<br />{rowdata.AbsoluteYesCount} Votes</td>
          <td>
            {green_comment}
            {red_comment}
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td colSpan="9">{t('govlist.loading')}</td>
        </tr>
      );
    }
  }
}

export default withTranslation()(GovListRow);