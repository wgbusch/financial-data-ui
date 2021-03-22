import {Dropdown, Form, Input, Menu, Modal, Tooltip} from "antd";
import {CloseOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {
    addWatchlist,
    DEFAULT_WATCHLIST_NAME,
    deleteWatchlist,
    getWatchlistsNames
} from "../../../Common/LocalStorageWrapper";
import {successNotification} from "../../ToastNotifications";

export default function Watchlists({handleSelectWatchlist}) {

    const [visible, setVisible] = useState(false);

    const AddWatchlistModalForm = ({visible, onCancel}) => {
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
                            addWatchlist(title);
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
                                        const watchlists = getWatchlistsNames();

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
        if (name !== DEFAULT_WATCHLIST_NAME) {
            const currentWatchlist = deleteWatchlist(name);
            handleSelectWatchlist(currentWatchlist);
        } else {
            Modal.error({
                content: 'Can\'t delete default watchlist.',
                zIndex: 2000,
            });
        }
    }

    const WatchlistsMenu = () => {
        const watchlists = getWatchlistsNames();

        const WatchlistsMenuItem = ({tooltip, iconType, name, handleIconSelect, handleSelect, ...props}) => {
            const iconStyle = {
                backgroundColor: 'lightgrey',
                margin: '0.2em',
                height: 'min-content',
                alignSelf: 'center'
            };
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

        return (
            <Menu>
                <WatchlistsMenuItem name={'New watchlist'} key={0} handleSelect={handleAddWatchlist}
                                    handleIconSelect={handleAddWatchlist} tooltip={""} iconType='add'/>
                {watchlists.map((name, i) =>
                    <WatchlistsMenuItem name={name} key={i + 1} handleSelect={(name) =>{handleSelectWatchlist(name) }}
                                        handleIconSelect={handleDeleteWatchlist} tooltip={"Delete watchlist"}
                                        iconType='delete'/>)}
            </Menu>);
    }

    const handleAddWatchlist = () => {
        setVisible(true);
    }

    return (
        <>
            <Dropdown.Button overlay={WatchlistsMenu} className="ant-btn-link dropdown-btn"
                             style={{display: 'inline'}}
                             icon={<UnorderedListOutlined style={{alignSelf: 'center'}} className="ant-btn-link"/>}
            >
            </Dropdown.Button>
            <AddWatchlistModalForm
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </>
    );
}
