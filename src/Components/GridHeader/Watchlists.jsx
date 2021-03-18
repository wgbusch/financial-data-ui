import {Dropdown, Form, Input, Menu, Tooltip, Modal} from "antd";
import {CloseOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import React from "react";
import {LocalStorageWrapper} from "../../Common/LocalStorageWrapper";
import './GridHeader.css'


function Watchlists({setCurrentWatchlist}) {

    const [form] = Form.useForm();

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

    const handleOk = ({watchlistname}) => {
        const local = new LocalStorageWrapper();
        local.addWatchlist(watchlistname);
    };

    const handleFailedAddWatchlist = (props) => {
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
    };

    return (
        <Dropdown.Button overlay={getMenu} className="dropdown-btn"
                         size={'small'}
                         style={{backgroundColor: 'transparent', alignSelf: 'center'}}
                         icon={<UnorderedListOutlined/>}
        >
        </Dropdown.Button>
    );
}

export default Watchlists;