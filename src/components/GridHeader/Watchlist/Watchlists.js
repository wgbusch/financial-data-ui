import {Dropdown, Form, Input, Menu, Tooltip} from "antd";
import {CloseOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import React from "react";
import AddNewWatchlist from "../AddNewWatchlist";
import {LocalStorageWrapper} from "../../LocalStorageWrapper";
import Modal from "antd/es/modal/Modal";
import {any} from "prop-types";

function Watchlists({getCurrentWatchlist}) {

    const [addVisible, setAddVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [form] = Form.useForm();

    const handleDeleteWatchlist = (name) => {
        let local = new LocalStorageWrapper();
        local.deleteWatchlist(name);
        console.log(name)
    }

    const handleSelectWatchlist = (name) => {
        getCurrentWatchlist(name);
    }


    const getMenu = () => {
        let local = new LocalStorageWrapper();
        const watchlists = local.getWatchlistsNames();

        return (
            <Menu>
                <Menu.Item onClick={handleAddWatchlist}
                           icon={<PlusOutlined style={{backgroundColor: 'lightgrey'}}/>} enabled={"true"}>
                    <a target="_blank" rel="noopener noreferrer">
                        New watchlist
                    </a>
                </Menu.Item>
                {watchlists.map((name, i) =>
                    <Menu.Item key={i}
                               icon={<Tooltip title="Delete watchlist"> <CloseOutlined
                                   onClickCapture={() => handleDeleteWatchlist(name)}
                                   style={{backgroundColor: 'lightgrey'}}
                                   />
                               </Tooltip>} enabled={"true"}
                               onClick={() => handleSelectWatchlist(name)}>
                        <a target="_blank" rel="noopener noreferrer">
                            {name}
                        </a>
                    </Menu.Item>)}
            </Menu>);
    }

    const handleAddWatchlist = () => {
        setAddVisible(true);
    }

    const handleOk = ({watchlistname}) => {
        const local = new LocalStorageWrapper();
        local.addWatchlist(watchlistname);
        setAddVisible(false);
    };

    const handleCancel = () => {
        setAddVisible(false);
    };


    return (
        <div>
            <div className="ant-btn ant-btn-link actions"
                 style={{
                     fontSize: '1.5em',
                     backgroundColor: 'transparent',
                     verticalAlign: 'center',
                     alignSelf: 'center'
                 }}>
                <Dropdown.Button overlay={getMenu} className="dropdown-btn" icon={
                    <UnorderedListOutlined
                        style={{
                            fontSize: '28px',
                            backgroundColor: 'transparent',
                            borderRadius: '50%',
                        }}
                    />
                }>
                </Dropdown.Button>
                Watchlists

                <Modal
                    title="New watchlist"
                    visible={addVisible}
                    onOk={form.submit}
                    onCancel={handleCancel}
                >
                    <Form
                        form={form}
                        name="basic"
                        initialValues={{remember: false}}
                        onFinish={handleOk}
                    >
                        <Form.Item
                            label="Watchlist name"
                            name="watchlistname"
                            rules={[{
                                required: true,
                                type: 'string',
                                pattern: '^[a-zA-Z0-9 ]{1,20}$',
                                message: 'Only numbers, letters and spaces are allowed. Max. of 20 characters.'
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            {/*<AddNewWatchlist visible={false}/>*/}
        </div>
    );
}

export default Watchlists;