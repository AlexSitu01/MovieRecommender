import { movie_status } from "@/app/(app)/movies/[id]";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import {
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    UIManager,
    View,
    findNodeHandle,
} from "react-native";

 export type OptionItem = {
  value: movie_status;
  label: string;
};

interface DropDownProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  placeholder: string;
}

export default function Dropdown({
  data,
  onChange,
  placeholder,
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [menuWidth, setMenuWidth] = useState<number | null>(null);

  const buttonRef = useRef<View>(null);

  const toggleExpanded = useCallback(() => {
    if (!expanded && buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          // Store width only once if not already set
          if (!menuWidth) setMenuWidth(width);

          setPosition({
            top: y + height + (Platform.OS === "android" ? 0 : 3),
            left: x,
          });
          setExpanded(true);
        });
      }
    } else {
      setExpanded(false);
    }
  }, [expanded, menuWidth]);

  const onSelect = useCallback(
    (item: OptionItem) => {
      onChange(item);
      setValue(item.label);
      setExpanded(false);
    },
    [onChange]
  );

  return (
    <>
      {/* Dropdown button */}
      <View ref={buttonRef} onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        if (!menuWidth) setMenuWidth(width);
      }}>
        <TouchableOpacity
          style={[styles.button, menuWidth ? { width: menuWidth } : null]}
          activeOpacity={0.8}
          onPress={toggleExpanded}
        >
          <Text
            style={[styles.text]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {value || placeholder}
          </Text>
          <AntDesign
            className={expanded ? "caretup" : "caretdown"}
            size={16}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Dropdown options (in modal) */}
      <Modal visible={expanded} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
          <View style={styles.backdrop}>
            <View
              style={[
                styles.dropdown,
                {
                  position: "absolute",
                  top: position.top,
                  left: position.left,
                  width: menuWidth ?? "auto",
                },
              ]}
            >
              <FlatList
                nestedScrollEnabled
                keyExtractor={(item) => item.value}
                data={data}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.optionItem}
                    onPress={() => onSelect(item)}
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  button: {
    height: 35,
    justifyContent: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  text: {
    fontSize: 15,
    opacity: 0.8,
    flexShrink: 1,
    maxWidth: "100%",
    fontWeight: 500
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 6,
    paddingVertical: 5,
    maxHeight: 250,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  optionItem: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
