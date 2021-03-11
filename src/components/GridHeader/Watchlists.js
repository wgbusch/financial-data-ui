import {Dropdown, Form, Input, Menu, Tooltip} from "antd";
import {CloseOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import React from "react";
import {LocalStorageWrapper} from "../LocalStorageWrapper";
import Modal from "antd/es/modal/Modal";
import './GridHeader.css'


function Watchlists({getCurrentWatchlist}) {

    const [addVisible, setAddVisible] = React.useState(false);
    const [form] = Form.useForm();

    const handleDeleteWatchlist = (name) => {
        let local = new LocalStorageWrapper();
        if (name !== local.DEFAULT_WATCHLIST) {
            const currentWatchlist = local.deleteWatchlist(name);
            getCurrentWatchlist(currentWatchlist);
        } else {
            Modal.error({
                content: 'Can\'t delete default watchlist.',
                zIndex: 2000,
            });
        }
    }

    const handleSelectWatchlist = (name) => {
        const local = new LocalStorageWrapper();
        local.setCurrentWatchlist(name);
        getCurrentWatchlist(name);
    }

    const CustomMenuItem = (props) => {
        const iconStyle = {backgroundColor: 'lightgrey', margin: '0.2em', height: 'min-content', alignSelf: 'center'};
        const onClickHandler = () => {
            props.handleIconSelect(props.name);
        };
        return (<div style={{display: 'flex', alignContent: 'space-around'}}>
            <Tooltip title={props.tooltip}>
                {props.iconType === 'add' ? <PlusOutlined
                    onClick={onClickHandler}
                    style={iconStyle}
                /> : <CloseOutlined
                    onClick={onClickHandler}
                    style={iconStyle}
                />}
            </Tooltip>
            <Menu.Item {...props}
                       style={{width: '100%'}}
                       enabled={"true"}
                       onClick={() => {
                           props.handleSelect(props.name)
                       }}>
                <a target="_blank" rel="noopener noreferrer">
                    {props.name}
                </a>
            </Menu.Item>
        </div>)
    };

    const getMenu = () => {
        let local = new LocalStorageWrapper();
        const watchlists = local.getWatchlistsNames();

        return (
            <Menu>
                <CustomMenuItem name={'New watchlist'} key={0} handleSelect={handleAddWatchlist}
                                handleIconSelect={handleAddWatchlist} tooltip={""} iconType='add'/>
                {watchlists.map((name, i) =>
                    <CustomMenuItem name={name} key={i + 1} handleSelect={handleSelectWatchlist}
                                    handleIconSelect={handleDeleteWatchlist} tooltip={"Delete watchlist"}
                                    iconType='delete'/>)}
            </Menu>);
    }

    const handleOk = ({watchlistname}) => {
        const local = new LocalStorageWrapper();
        local.addWatchlist(watchlistname);
        setAddVisible(false);
    };

    const handleFailedAddWatchlist = (props) => {
        setAddVisible(true);
    }

    const handleClickSubmit = () => {
        const hasErrors = form.getFieldsError().filter((field) => field.errors.length > 0).length > 0;
        if (!hasErrors) {
            form.submit();
        }
    }

    const handleAddWatchlist = () => {

        const content =
            <Form
                form={form}
                name="basic"
                initialValues={{remember: false}}
                onFinish={handleOk}
                onFinishFailed={handleFailedAddWatchlist}
            >
                <Form.Item
                    label="Watchlist name"
                    name="watchlistname"
                    autocomplete={false}
                    preserve={false}
                    rules={[{
                        required: true,
                        type: 'string'
                    },
                        () => ({
                            validator(rule, value) {
                                return new Promise((resolve, reject) => {
                                    const local = new LocalStorageWrapper();
                                    const watchlists = local.getWatchlistsNames();

                                    if (watchlists.includes(value)) {
                                        reject("Watchlist already exists");
                                    } else if (value && value.length > 20) {
                                        reject("Maximum of 20 characters allowed.")
                                    } else {
                                        resolve();
                                    }
                                });
                            }
                        })
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Form>;

        Modal.info({
            title: "New watchlist",
            zIndex: 2000,
            onOk: handleClickSubmit,
            onCancel: handleCancel,
            content: content,
            closable: true,
            keyboard: true,
        });
    }

    const handleCancel = () => {
        setAddVisible(false);
    };

    return (
        <div>
            <div className="ant-btn ant-btn-link actions">
                <Dropdown.Button overlay={getMenu} className="dropdown-btn" icon={
                    <span>
                        <UnorderedListOutlined
                            style={{
                                fontSize: '28px',
                                backgroundColor: 'transparent',
                                borderRadius: '50%',
                            }}
                        />  Watchlists
                    </span>
                }>
                </Dropdown.Button>
            </div>
        </div>
    );
}

export default Watchlists;