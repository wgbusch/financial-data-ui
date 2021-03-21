import {Dropdown, Form, Input, Menu, Modal, Tooltip} from "antd";
import {CloseOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {LocalStorageWrapper} from "../../../Common/LocalStorageWrapper";
// import './GridHeader.css'
import {successNotification} from "../../ToastNotifications";

export default function Watchlists({setCurrentWatchlist}) {

    const [visible, setVisible] = useState(false);

    const WatchlistDropdown = ({visible, onCancel}) => {
        const [form] = Form.useForm();
        return (
            <Modal
                visible={visible}
                title="New watchlist"
                zIndex={2000}
                okText="Create"
                cancelText="Cancel"
                closable={true}
                keyboard={true}
                onCancel={onCancel}
                onOk={() => {
                    form.validateFields()
                        .then(({title}) => {
                            form.resetFields();
                            const local = new LocalStorageWrapper();
                            local.addWatchlist(title);
                            setVisible(false);
                            successNotification('Watchlist created');
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of watchlist.',
                            },
                            () => ({
                                validator(rule, value) {
                                    return new Promise((resolve, reject) => {
                                        const local = new LocalStorageWrapper();
                                        const watchlists = local.getWatchlistsNames();

                                        if (watchlists.includes(value)) {
                                            reject("Watchlist already exists.");
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
                </Form>
            </Modal>
        );
    };


    const handleDeleteWatchlist = (name) => {
        let local = new LocalStorageWrapper();
        if (name !== local.DEFAULT_WATCHLIST_NAME) {
            const currentWatchlist = local.deleteWatchlist(name);
            setCurrentWatchlist(currentWatchlist);
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
        setCurrentWatchlist(name);
    }

    const CustomMenuItem = ({tooltip, iconType, name, handleIconSelect, handleSelect, ...props}) => {
        const iconStyle = {backgroundColor: 'lightgrey', margin: '0.2em', height: 'min-content', alignSelf: 'center'};
        const onClickHandler = () => {
            handleIconSelect(name);
        };

        return (<div style={{display: 'flex', alignContent: 'space-around'}}>
            <Tooltip title={tooltip}>
                {iconType === 'add' ? <PlusOutlined
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
                           handleSelect(name)
                       }}>
                <a target="_blank" rel="noopener noreferrer">
                    {name}
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

    const handleAddWatchlist = () => {
        setVisible(true);
    }

    return (
        <>
            <Dropdown.Button overlay={getMenu} className="ant-btn-link dropdown-btn"
                             style={{display: 'inline'}}
                             icon={<UnorderedListOutlined style={{alignSelf: 'center'}} className="ant-btn-link"/>}
            >
            </Dropdown.Button>
            <WatchlistDropdown
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </>
    );
}
