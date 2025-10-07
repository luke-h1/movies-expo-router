"use client";

import * as AC from "@bacons/apple-colors";
import { useState } from "react";
import { LayoutAnimation, Text, TouchableOpacity } from "react-native";

LayoutAnimation.easeInEaseOut();

interface Props {
  text: string;
}

export default function ShowMore({ text }: Props) {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <>
      <Text
        numberOfLines={showMore ? undefined : 5}
        style={{
          color: AC.label,
          lineHeight: 20,
          fontSize: 16,
        }}
      >
        {text}
      </Text>
      {text?.length > 250 && (
        <TouchableOpacity onPress={() => setShowMore(!showMore)}>
          <Text
            style={{
              color: AC.systemBlue,
              marginTop: 8,
              fontSize: 16,
            }}
          >
            {showMore ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}
