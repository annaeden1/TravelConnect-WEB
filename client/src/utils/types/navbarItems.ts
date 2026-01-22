import { type SvgIconTypeMap } from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ClientRoutes from "../appRoutes";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type NavbarProps = {
    label: string;
    path: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
};

const navItems : NavbarProps[] = [
    { label: "Home", path: ClientRoutes.HOME, icon: HomeOutlinedIcon },
    { label: "AI Assistant", path: ClientRoutes.AI, icon: ChatBubbleOutlineOutlinedIcon },
    { label: "Create Post", path: ClientRoutes.POST, icon: AddBoxOutlinedIcon },
    { label: "Profile", path: ClientRoutes.PROFILE, icon: PersonOutlineOutlinedIcon },
];

export default navItems;