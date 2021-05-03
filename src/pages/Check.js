import React, { Component } from 'react';
import InnerBanner from '../parts/InnerBanner';
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import MetaTags from 'react-meta-tags';
import { withTranslation } from "react-i18next";

const getColumns = (t) => {
    return  [
        {
            text: t('check.table.address'),
            dataField: 'address'
        },
        {
            text: t('check.table.status'),
            dataField: 'status'
        },
        {
            text: t('check.table.payee'),
            dataField: 'payee'
        },
        {
            text: t('check.table.lastpaidtime'),
            dataField: 'lastpaidtime'
        },
    ];
}

const RemotePagination = ({ data, page, sizePerPage, onTableChange, totalSize, onSizeChange, changeFieldOrder, t }) => (
    <div>
      <PaginationProvider
        pagination={
          paginationFactory({
            custom: true,
            page,
            sizePerPage,
            totalSize
          })
        }
      >
        {
          ({
            paginationProps,
            paginationTableProps
          }) => (
            <div>
              <BootstrapTable
                remote
                keyField="address"
                data={ data }
                columns={ getColumns(t) }
                onTableChange={ onTableChange }
                { ...paginationTableProps }
              />
              <div className="page-row">
                  <div className="pull-left">
                        <p>
                            {`${t('check.legend.d1')} ${totalSize>0?paginationProps.page>1?(paginationProps.sizePerPage*(paginationProps.page-1))+1:1:0} ${t('check.legend.d2')} ${(paginationProps.sizePerPage*paginationProps.page)>totalSize?totalSize:(paginationProps.sizePerPage*paginationProps.page)} ${t('check.legend.d3')} ${totalSize} ${t('check.legend.d4')} `}
                            <input type="number" value={sizePerPage} onChange={ onSizeChange } className="form-psize"/>
                        </p>
                  </div>
                  <div className="pull-right">
                        <PaginationListStandalone
                        { ...paginationProps }
                        />
                  </div>
              </div>

            </div>
          )
        }
      </PaginationProvider>
    </div>
  );


export class Check extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataload: 0,
            page: 1,
            tableData: [],
            sizePerPage: 30,
            totalRecords: 0
        }
        this.searchInTable = this.searchInTable.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.onSizeChange = this.onSizeChange.bind(this);
        this.changeFieldOrder = this.changeFieldOrder.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }
    searchInTable(e) {
        this.loadData(e.target.value);
    }
    resetSearch() {
        document.getElementById('srcVal').value="";
        this.loadData();
    }
    handleTableChange = (type, { page, sizePerPage }) => {
        this.setState({
            dataload:0
        });
        var src=document.getElementById('srcVal').value;
        this.loadData(src,page,sizePerPage);
    }
    changeFieldOrder(field,order) {

    }
    onSizeChange(e) {
        var size=e.target.value;
        var pagenum=this.state.page;
        var src=document.getElementById('srcVal').value;
        this.loadData(src,pagenum,size);
    }
    async loadData(srcData,page,sizePerPage) {
        var postData = {
            "page": this.state.page,
            "search": "",
            "sortBy": "lastPayment",
            "sortDesc": true,
            "perPage": this.state.sizePerPage
        };
        if(srcData!==undefined && parseInt(page)>=1) {
            postData.page = page;
            this.setState({
                page:page
            });
        }
        if(sizePerPage!==undefined && parseInt(sizePerPage)>=1) {
            postData.perPage = sizePerPage;
            this.setState({
                sizePerPage:sizePerPage
            });
        }
        if(srcData!==undefined && srcData!=="") {
            postData.search = srcData;
        }
        console.log(postData);
        let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain, */*',
            "Access-Control-Allow-Origin": "*",
        }
        };

        await axios.post('https://syscoin.dev/mnSearch', postData, axiosConfig)
        .then((res) => {
            this.setState({
                dataload: 1,
                tableData: res.data.returnArr,
                totalRecords: res.data.mnNumb
            });
        })
        .catch((err) => {
            this.setState({
                dataload: 2
            });
        });
    }
    render() {
        const { dataload, page, tableData, sizePerPage, totalRecords } = this.state;
        const { t } = this.props;

        if(dataload===1) {
        return(
            <main className="checkPage">
                <MetaTags>
                        <title>{t('check.meta.title')}</title>
                        <meta name="keywords" content={t('check.meta.keywords')} />
                        <meta name="description" content={t('check.meta.description')} />
                </MetaTags>
                <InnerBanner heading={t('check.title')}/>
                <section className="section_datatable bg-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 small">
                        <div className="custom__datatable table-responsive">
                            <div className="pc-left">
                                <button type="button" className="btn-default p-2 mb-2" onClick={this.resetSearch}>{t('check.table.resetBtn')}</button>
                            </div>
                            <div className="pc-right">
                                <input id="srcVal" type="text" className="form-control" placeholder={t('check.table.ipInput')} onKeyUp={this.searchInTable}/>
                            </div>
                        </div>

                        <RemotePagination
                            data={ tableData }
                            page={ page }
                            sizePerPage={ sizePerPage }
                            totalSize={ totalRecords }
                            onTableChange={ this.handleTableChange }
                            onSizeChange={ this.onSizeChange }
                            changeFieldOrder={this.changeFieldOrder }
                            t= {t}
                        />
                    </div>
                </div>
            </div>
        </section>
            </main>
        )
        } else {
            return(
                <main className="checkPage">
                    <MetaTags>
                        <title>{t('check.meta.title')}</title>
                        <meta name="keywords" content={t('check.meta.keywords')} />
                        <meta name="description" content={t('check.meta.description')} />
                    </MetaTags>
                <InnerBanner heading="Masternode Check"/>
                <section className="section_datatable bg-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="custom__datatable table-responsive">

                        </div>

                        <p>{t('check.loading')}</p>
                    </div>
                </div>
            </div>
        </section>
            </main>
            )
        }
    }
}

export default withTranslation()(Check);
